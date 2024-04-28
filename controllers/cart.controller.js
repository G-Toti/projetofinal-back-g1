import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToCart = async (req, res) => {
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
  const cart = await prisma.cart.update({
    where: {
      id: req.body.id,
    },
    data: {
      product: {
        disconnect: req.body.product,
      },
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
    return res.status(400).json({
      msg: "Nenhum produto no carrinho! Por favor, adicione ao menos um produto a esse carrinho antes de prosseguir.",
    });
  }

  const products = await prisma.product.updateMany({
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

  await prisma.cart.update({
    where: {
      id: req.body.id,
    },
    data: {
      product: {
        disconnect: req.body.product,
      },
    },
  });

  res.status(200).json({
    data: products,
    msg: "Venda concluida com sucesso!",
  });
};
