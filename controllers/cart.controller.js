import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isAvailable = async (productId) => {
  const exists = await prisma.product.findFirst({
    where: {
      id: {
        in: productId.map((p) => p.id),
      },
    },
  });

  if (!exists) return false;

  const product = await prisma.product.findMany({
    where: {
      id: {
        in: productId.map((p) => p.id),
      },
    },
  });

  return product.every((current) => current.stock > 0);
};

const isInCart = async (productId, cartId) => {
  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
    },
    include: {
      product: true,
    },
  });

  const products = productId.map((p) => p.id);

  return (
    cart.product
      .map((p) => p.id)
      .every((current) => products.includes(current)) && cart.product.length > 0
  );
};

export const addToCart = async (req, res) => {
  if (!(await isAvailable(req.body.product))) {
    // verifica se o produto ainda está disponível
    return res.status(400).json({
      msg: "O produto que você está tentando adicionar ao carrinho está esgotado ou não existe. Por favor, busque por outro em nossa loja!",
    });
  }

  await prisma.cart.update({
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
  if (!(await isInCart(req.body.product, req.body.id))) {
    return res.status(400).json({
      msg: "Houve uma tentativa de remover um item que não está no carrinho ou não existe. Por favor, verifique o body da requisição e tente novamente.",
    });
  }

  await prisma.cart.update({
    where: {
      id: req.body.id,
    },
    data: {
      product: {
        disconnect: req.body.product,
      },
    },
    include: {
      product: true,
    },
  });

  res.status(200).json({
    msg: "Produto removido com sucesso!",
  });
};

export const sellProduct = async (req, res) => {
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

  if (!(await isAvailable(req.body.product))) {
    // verifica se os produtos ainda estão no estoque
    return res.status(400).json({
      msg: "Um dos produtos que você está tentando comprar está esgotado ou não existe. Por favor, busque por outro em nossa loja!",
    });
  }

  if (!(await isInCart(req.body.product, req.body.id))) {
    return res.status(400).json({
      msg: "Houve uma tentativa de comprar um item que não está no carrinho ou não existe. Por favor, verifique o body da requisição e tente novamente.",
    });
  }

  await prisma.product.updateMany({
    where: {
      AND: {
        id: {
          // O 'in' verifica se o dado buscado está no array, então nesse caso ele faz um map (pra poder converter o array de objs em um array de ids) e verifica para cada id enviado na requisição.
          in: req.body.product.map((product) => product.id),
        },
        cart: {
          some: {
            // para arrays tem que usar mais algumas paravras chave, como o some, por exemplo. O some vai verificar se ao menos um item do array bate com um dos ids dos carrinos
            id: req.body.id,
          },
        },
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

  const updatedCart = await prisma.cart.update({
    // remove os produtos do carrinho
    where: {
      id: req.body.id,
    },
    data: {
      product: {
        disconnect: req.body.product,
      },
    },
    include: {
      product: true,
    },
  });

  res.status(200).json({
    msg: "Venda concluida com sucesso!",
  });
};
