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
