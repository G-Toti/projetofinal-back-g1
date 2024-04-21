import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  // criando o produto
  const product = await prisma.product.create({
    data: {
      // informações passadas no body
      name: req.body.name,
      price: parseFloat(req.body.price),
      description: req.body.description,
      image: req.file.path,
      stock: parseInt(req.body.stock),
      sold: 0,
      cart: {
        create: [],
      },
    },
  });

  res.status(201).json({
    // o produto foi criado sem erros
    data: product,
    msg: "Produto criado com sucesso!",
  });
};

export const getProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: req.query.name
      }
    }
  })

  res.json({
    data: products,
    msg: "Produtos encontrados com sucesso!"
  })
}
