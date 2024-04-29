import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isAvailable = async (productId) => {
  const product = await prisma.product.findMany({
    where: {
      id: {
        in: productId.map((p) => p.id),
      },
    },
  });

  return product.every((current) => current.stock > 0) && product.length > 0;
};

export const addToCart = async (req, res) => {
  if (!(await isAvailable(req.body.product))) {
    // verifica se o produto ainda está disponível
    return res.status(400).json({
      msg: "O produto que você está tentando adicionar ao carrinho está esgotado ou não existe. Por favor, busque por outro em nossa loja!",
    });
  }

  const cart = await prisma.cart.update({
    // como o carrinho tem o mesmo id do usuario sempre, posso fazer isso
    where: {
      id: req.body.id,
    },
    data: {
      product: {
        connect: req.body.product,
      },
    },
  });

  res.status(200).json({
    msg: "Produto adicionado com sucesso!",
  });
};

export const removeFromCart = async (req, res) => {
  const product = await prisma.cart
    .update({
      where: {
        id: req.body.id,
        product: {
          some: {
            id: {
              in: req.body.product.map((p) => p.id),
            },
          },
        },
      },
      data: {
        product: {
          disconnect: req.body.product,
        },
      },
      include: {
        product: true,
      },
    })
    .catch(() => {
      return null;
    });

  if (product === null) {
    return res.status(400).json({
      msg: "Ao menos um dos itens enviados não está no carrinho ou não existe. Portanto, não é possível removê-los.",
    });
  }

  res.status(200).json({
    msg: "Produto removido com sucesso!",
  });
};

export const sellProduct = async (req, res) => {
  const productsIds = req.body.product.map((p) => p.id);
  const cart = await prisma.cart.findUnique({
    where: {
      id: req.body.id,
    },
    include: {
      product: true,
    },
  });

  if (cart.product.length === 0) {
    // verifica se o carrinho tem algum produto
    return res.status(400).json({
      msg: "Nenhum produto no carrinho! Por favor, adicione ao menos um produto a esse carrinho antes de prosseguir.",
    });
  }

  if (
    !productsIds.every((current) =>
      cart.product.map((p) => p.id).includes(current)
    )
  ) {
    // verificar se todos os produtos que estão sendo enviados para a compra estão no carrinho
    return res.status(400).json({
      msg: "Ao menos um dos itens enviados não está no carrinho ou não existe. Busque pelos produtos desejados na loja.",
    });
  }

  const newCart = await prisma.cart
    .update({
      // remove os produtos do carrinho
      where: {
        id: req.body.id,
        product: {
          // verificando se todos os produtos que foram para o carrinho, estão sendo enviados para a compra
          every: {
            id: {
              in: productsIds,
            },
          },
        },
      },
      data: {
        product: {
          disconnect: req.body.product,
        },
      },
      include: {
        product: true,
      },
    })
    .catch(() => {
      return null;
    });

  if (newCart === null) {
    return res.status(400).json({
      msg: "Há produtos no carrinho que não foram enviados na requisição. Verifique as informações e tente novamente.",
    });
  }

  await prisma.product.updateMany({
    // atualiza todos os produtos
    where: {
      // como é um update many e eu não estou buscando uma relação e sim o obj, então eu não preciso do every
      id: {
        // O 'in' verifica se o dado buscado está no array, então nesse caso ele faz um map (pra poder converter o array de objs em um array de ids) e verifica para cada id enviado na requisição.
        in: productsIds,
      },
    },
    data: {
      stock: {
        decrement: 1,
      },
      sold: {
        increment: 1,
      },
    },
  });

  res.status(200).json({
    msg: "Venda concluida com sucesso!",
  });
};
