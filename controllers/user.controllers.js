import { PrismaClient } from "@prisma/client";
import generateToken from "../utils/jwt.js";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  // verificando se o usuário existe
  const exists = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
    select: {
      email: true,
    },
  });

  if (exists)
    // se o email já foi cadastrado, ele não pode ser cadastrado novamente
    return res.status(400).json({
      data: exists,
      msg: "Email já cadastrado. O email é uma chave única e não pode ser cadastrada duas vezes.",
    });

  const user = await prisma.user.create({
    // criando o usuário
    data: {
      // as informações serão enviadas no body da requisição
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      profile: {
        create: {
          name: req.body.name,
          cart: {
            create: {
              product: { create: [] },
            },
          },
        },
      },
    },
  });

  const token = generateToken(user); // gerando token de acesso

  res.status(201).json({
    // retornando informações do usuário criado
    data: user,
    token: token,
    msg: "Usuário criado com sucesso!",
  });
};

export const login = async (req, res) => {
  const user = await prisma.user.findFirst({
    // buscando usuário com esse email e senha
    where: {
      AND: {
        email: req.body.email,
        password: req.body.password,
      },
    },
  });

  if (user === null) {
    // nenhum usuário encontrado
    return res.status(403).json({
      msg: "Email ou senha incorretos.",
    });
  }

  const token = generateToken(user); // gerando o token de acesso
  res.json({
    // deu tudo certo, o usuário foi logado
    data: user,
    token: token,
    msg: "Login realizado com sucesso!",
  });
};
