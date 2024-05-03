# BACK-END

Back-end do projeto final da capacitação de node.js da byron

## SUMÁRIO
- [BACK-END](#back-end)
  - [SUMÁRIO](#sumário)
  - [Instalação](#instalação)
    - [Banco de dados](#banco-de-dados)
    - [Clonando o repositório](#clonando-o-repositório)
    - [Instalando dependências](#instalando-dependências)
  - [Configurando o projeto](#configurando-o-projeto)
  - [Uso do projeto](#uso-do-projeto)
    - [Inicializar o projeto](#inicializar-o-projeto)
    - [Visualizando o banco de dados](#visualizando-o-banco-de-dados)
  - [Rotas](#rotas)
    - [Usuário](#usuário)
    - [Cadastro](#cadastro)
    - [Login](#login)
    - [Produtos](#produtos)
    - [Cadastro](#cadastro-1)
    - [Busca por vários produtos](#busca-por-vários-produtos)
    - [Busca por produto específico](#busca-por-produto-específico)
    - [Carrinho](#carrinho)
    - [Adicionar](#adicionar)
    - [Remover](#remover)
    - [Fechar](#fechar)
  - [Respostas](#respostas)
    - [Usuarios](#usuarios)
    - [Cadastro](#cadastro-2)
      - [Email já cadastrado](#email-já-cadastrado)
      - [Sucesso](#sucesso)
    - [Login](#login-1)
      - [Dados Incorretos](#dados-incorretos)
      - [Sucesso](#sucesso-1)
  - [Produtos](#produtos-1)
    - [Cadastro](#cadastro-3)
      - [Autenticador não enviado](#autenticador-não-enviado)
      - [Token Inválido](#token-inválido)
      - [Usuário não é um administrador](#usuário-não-é-um-administrador)
      - [Token em formato inválido](#token-em-formato-inválido)
      - [Sucesso](#sucesso-2)
    - [Busca por vários produtos](#busca-por-vários-produtos-1)
      - [Nenhum produto encontrado](#nenhum-produto-encontrado)
      - [Sucesso](#sucesso-3)
    - [Busca por produto específico](#busca-por-produto-específico-1)
      - [Produto não foi encontrado](#produto-não-foi-encontrado)
      - [Sucesso](#sucesso-4)
  - [Carrinho](#carrinho-1)
    - [Geral](#geral)
      - [Autenticador não enviado](#autenticador-não-enviado-1)
      - [Token Inválido](#token-inválido-1)
      - [Usuário Inválido](#usuário-inválido)
      - [Token em formato inválido](#token-em-formato-inválido-1)
    - [Adicionar](#adicionar-1)
      - [Indisponível](#indisponível)
      - [Sucesso](#sucesso-5)
    - [Remover](#remover-1)
      - [Produtos não estão no carrinho](#produtos-não-estão-no-carrinho)
      - [Sucesso](#sucesso-6)
    - [Fechar](#fechar-1)
      - [Nenhum produto no carrinho](#nenhum-produto-no-carrinho)
      - [Produtos enviados não estão no carrinho](#produtos-enviados-não-estão-no-carrinho)
      - [Quantidade excessiva](#quantidade-excessiva)
      - [Produtos ausentes](#produtos-ausentes)
      - [Sucesso](#sucesso-7)

## Instalação
### Banco de dados
Para realizar a instalação do projeto, será necessário ter instalado na sua máquina o banco de dados [MySQL](https://www.youtube.com/watch?v=73qWwJmnonM&list=PLc77ERAwzB_0jKpaiWxBQlroM9v6rU8Yz&index=3).

Siga o tutorial linkado acima para realizar a instalação.

### Clonando o repositório
Basta executar os comandos a baixo para ter o projeto na sua máquina

~~~cmd
    cd <diretorio desejado>
~~~

~~~bash
    git clone https://github.com/G-Toti/projetofinal-back-g1.git
~~~

Caso necessário, faça um pull na branch mais recente do projeto

~~~bash
    git pull origin <branch>
~~~

### Instalando dependências

Será necessário instalar as dependencias do projeto clonado utilizando o comando abaixo

~~~cmd
    npm install
~~~

Isso irá instalar todas as dependências do package.json

## Configurando o projeto

Para que seu banco de dados funcione, é necessário criar uma base de dados:
~~~sql
mysql -u root -p

# insira sua senha

create database nome_da_basededados;

~~~
No arquivo `.env` (caso ele não exista, crie um) deve-se ter as seguintes variáveis de ambiente:

~~~env
DATABASE_URL="mysql://root:SenhaDoSeuRoot@localhost:3306/nome_da_basededados?schema=public"

JWT_SECRET="8b48439f63b654bd3332a3ab4d47fd101f3e1e95e56c74bfe28169674cb89ec50219a8ce65be1aeea32bacc17137d52b8b07d0a95b2618e29c5bb330fb0adc28"
~~~

O `DATABASE_URL` é o que o projeto utilizará para encontrar seu banco de dados. A `porta` (3306) deve ser alterada para a porta utilizada na hora da configuração do seu banco de dados, bem como sua `senha`.

A porta pode ser consultada por meio dos seguintes comandos

~~~sql
mysql -u root -p

# insira sua senha

show variables like 'port';

~~~

O `JWT_SECRET` é o código que será utilizado para gerar os tokens e pode ser obtido por meio dos comandos

~~~js

node

require('crypto').randomBytes(64).toString('hex');

~~~

Por fim, é preciso subir as informações do prisma para o seu banco de dados
~~~cmd

npx prisma db push

~~~

## Uso do projeto

Para utilizar o projeto existem alguns comandos que serão importantes

### Inicializar o projeto

~~~cmd
    npm run dev
~~~
Quando o projeto for inicializado, um perfil de administrador será automaticamente criado no banco de dados local. Isso tem o propósito de facilitar o processo de testes da criação de produtos, que necessita de autenticação para ser utilizada.

Para utilizar esse usuário, basta utilizar a rota de login com o email admin@gmail.com e a senha admin1234 e utilizar o token gerado para fazer as requisições no header.

### Visualizando o banco de dados
~~~cmd
    npx prisma studio
~~~

Esse comando abrirá uma janela no navegador com o banco de dados local utilizado e todos os seus registros.

## Rotas

### Usuário
### Cadastro
Para cadastrar um novo usuário, basta utilizar o médodo `POST` na rota `/users` com os seguintes dados:

~~~json

{
    "email": "email@dousuario.com",
    "password": "senhaDoUsuario",
    "name": "Nome do Usuário",
    "role": false // true para criar um admin e false para criar um usuario comum
}

~~~
### Login
Para fazer login com um usuário, basta utilizar o médodo `POST` na rota `/users/login` com os seguintes dados:

~~~json

{
    "email": "email@dousuario.com",
    "password": "senhaDoUsuario",
}

~~~

### Produtos
### Cadastro
Para cadastrar um novo produto, basta utilizar o médodo `POST` na rota `/products` com os seguintes dados:

~~~json

{
    "name": "Nome do Produto",
    "price": 10.99, // comporta até 5 numeros à direita e 2 à esquerda
    "description": "Descrição do produto",
    "image": "", //aqui deve-se enviar um arquivo de imagem do produto
    "stock": 10, // quantidade disponível no estoque
}

~~~

### Busca por vários produtos
Basta enviar uma requisição GET para a rota `/products`. Essa requisição pode ser feita utilizando uma query filtrando por nome ou não. A query pode ser feita da seguinte maneira `/products?name=[...]`, substituindo '[...]' pelo nome buscado. Essa busca não diferencia letras maiusculas de minusculas e verifica se o nome enviado está presente no nome do produto. Por exemplo: a query 'C' retornará tanto um produto com o nome 'Carro', quanto 'Suco', pois a letra 'c' está presente em ambos

### Busca por produto específico
Basta enviar uma requisição GET para a rota `/products/id`. Sendo que o id deve ser substituido pelo id do produto buscado.

### Carrinho

### Adicionar
Basta enviar uma requisição com o metodo `PUT` para a rota `cart/add` com as informações a baixo
~~~json

{
    "id": 1, // id do carrinho (o mesmo do usuario)
	"product": [{"id": 5}] // lista de produtos
}

~~~

### Remover
Basta enviar uma requisição com o metodo `PUT` para a rota `cart/remove` com as informações a baixo
~~~json

{
    "id": 1, // id do carrinho (o mesmo do usuario)
	"product": [{"id": 5}] // lista de produtos
}

~~~

### Fechar
Basta enviar uma requisição com o metodo `PUT` para a rota `cart/sell` com as informações a baixo
~~~json

{
    "id": 1, // id do carrinho (o mesmo do usuario)
	"product": [{"id": 5, "quantity": 2}] // lista de produtos com id e quantidade que está sendo comprada
}

~~~



## Respostas

### Usuarios
### Cadastro
A rota de cadasto possui duas respostas possíveis:

#### Email já cadastrado
Já existe um usuário com esse email no banco de dados
~~~js

{
      data: user, // objeto do usuário que possui esse email (apenas com o email)
      msg: "Email já cadastrado. O email é uma chave única e não pode ser cadastrada duas vezes.",
}

~~~

#### Sucesso
O usuário foi criado
~~~js

{
    // retornando informações do usuário criado
    data: user, // objeto do usuario criado
    token: "token de autenticação",
    msg: "Usuário criado com sucesso!",
}

~~~

### Login
#### Dados Incorretos
Email ou senha criados não são compatíveis com nenhum usuário do banco de dados
~~~js
{
    // deu tudo certo, o usuário foi logado
    msg: "Email ou senha incorretos.",
}
~~~

#### Sucesso
O usuário foi logado
~~~js
{
    // deu tudo certo, o usuário foi logado
    data: user, //obejto do usuario logado
    token: "token de autenticação",
    msg: "Login realizado com sucesso!",
}
~~~

## Produtos
Os produtos possuem algumas respostas possíveis

### Cadastro

#### Autenticador não enviado
Significa que nenhum altenticador foi enviado no header
~~~js
{
      msg: "Nenhum autenticador encontrado. Verifique as informações do header e tente novamente.",
}
~~~

#### Token Inválido
O token enviado não é válido
~~~js
{
          data: user,
          token: token,
          msg: `Token para o usuário enviado é inválido`,
}
~~~

#### Usuário não é um administrador
O usuário que está tentando acessar essa rota não é um administardor
~~~js
{
          data: user, // usuario enviado
          token: token, // token enviado
          msg: `O usuário deve ser um administrador para poder acessar essa rota.`,
}
~~~

#### Token em formato inválido
O autenticador enviado no header não está em um formato válido. O formato esperado é: Bearer \<token\>

~~~js

{
      token: authenticator,
      msg: "Formato para o token inválido. Formato esperado: 'Bearer <token>'",
}

~~~

#### Sucesso
O produto foi criado
~~~js

{
    // o produto foi criado sem erros
    data: product, // objeto do produto criado
    msg: "Produto criado com sucesso!",
}

~~~

### Busca por vários produtos

#### Nenhum produto encontrado
Os parâmetros enviados na busca não encontraram nenhum resultado no banco de dados
~~~js

{
    msg: "Nenhum produto pode ser encontrado. Verifique os parâmetros de busca e tente novamente.",
}

~~~

#### Sucesso
~~~js

{
    data: products, // lista de produtos encontrados
    msg: "Produtos encontrados com sucesso!",
}

~~~

### Busca por produto específico

#### Produto não foi encontrado
O id enviado não existe no banco de dados
~~~js

{
    msg: "Produto não pode ser encontrado. Verifique os parâmetros de busca e tente novamente.",
}

~~~

#### Sucesso
~~~js

{
    data: product, // objeto do produto encontrado
    msg: "Produto encontrado com sucesso!",
}

~~~

## Carrinho

### Geral

#### Autenticador não enviado
Significa que nenhum altenticador foi enviado no header
~~~js
{
      msg: "Nenhum autenticador encontrado. Verifique as informações do header e tente novamente.",
}
~~~

#### Token Inválido
O token enviado não é válido
~~~js
{
          data: user,
          token: token,
          msg: `Token para o usuário enviado é inválido`,
}
~~~

#### Usuário Inválido
O usuário que está tentando acessar essa rota não é o usuário dono do carrinho que está sendo alterado
~~~js
{
    data: 
    {
        idUsuario: user.id, idEnviado: req.body.id, // id usuario é o id do carrinho do usuario logado, enquanto id enviado é o id que a requisição está tentando alterar 
    },
    token: token,
    msg: `O usuário que está tentando acessar essa rota não é o usuário dono desse perfil`,
}
~~~

#### Token em formato inválido
O autenticador enviado no header não está em um formato válido. O formato esperado é: Bearer \<token\>

~~~js

{
      token: authenticator,
      msg: "Formato para o token inválido. Formato esperado: 'Bearer <token>'",
}

~~~

### Adicionar

#### Indisponível
Algum dos produtos enviados na requisição não existe ou está com o estoque zerado

~~~js

{
    msg: "O produto que você está tentando adicionar ao carrinho está esgotado ou não existe. Por favor, busque por outro em nossa loja!",
}

~~~

#### Sucesso
~~~js
{
    msg: "Produto adicionado com sucesso!",
}
~~~

### Remover

#### Produtos não estão no carrinho
Nenhum dos produtos que foi enviado na requisição estão no carrinho
~~~js
{
    msg: "Nenhum dos itens enviados está no carrinho ou não existe. Portanto, não é possível removê-los.",
}
~~~

#### Sucesso
~~~js
{
    msg: "Produto removido com sucesso!",
}
~~~

### Fechar

#### Nenhum produto no carrinho
Nenhum produto foi adicionado no carrinho antes de fechá-lo

~~~js
{
    msg: "Nenhum produto no carrinho! Por favor, adicione ao menos um produto a esse carrinho antes de prosseguir.",
}
~~~

#### Produtos enviados não estão no carrinho
Algum dos produtos enviados na requisição de fechamento não está no carrinho, ou por problema na requisição ou por não existir

~~~js
{
    msg: "Ao menos um dos itens enviados não está no carrinho ou não existe. Busque pelos produtos desejados na loja.",
}
~~~

#### Quantidade excessiva
Algum dos produtos enviados na requisição está solicitando uma quantidade do produto maior do que a quantidade presente no estoque
~~~js
{
    msg: "A quantidade de ao menos um dos produtos enviados é maior que a quantidade desse produto no estoque. Por favor, verifique a requisição!",
}
~~~

#### Produtos ausentes
Algum dos produtos que está no carrinho não está sendo enviado na requisição

~~~js
{
    msg: "Há produtos no carrinho que não foram enviados na requisição. Verifique as informações e tente novamente.",
}
~~~

#### Sucesso
~~~js
{
    msg: "Venda concluida com sucesso!",
}
~~~