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

export const getProduct = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(req.params.productId),
    },
  });

  if (!product)
    return res.status(404).json({
      msg: "Produto não pode ser encontrado. Verifique os parâmetros de busca e tente novamente.",
    });

  res.status(200).json({
    data: product,
    msg: "Produto encontrado com sucesso!",
  });
};

export const getProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: req.query.name,
      },
    },
  });

  if (!products.length)
    return res.status(404).json({
      msg: "Nenhum produto pode ser encontrado. Verifique os parâmetros de busca e tente novamente.",
    });

  res.status(200).json({
    data: products,
    msg: "Produtos encontrados com sucesso!",
  });
};
