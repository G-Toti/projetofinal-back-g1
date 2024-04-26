import express from "express";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import initAdmin from "./utils/init.js";

const app = express();
const port = 3001;

app.use(express.json());

app.use("/public", express.static("public")); // rota da pasta public
// as imagens podem ser acessadas com localhost:3001/public/nomedoarquivo.extensao

app.use("/users", userRouter); // rota dos usuarios
app.use("/products", productRouter); // rota dos produtos
app.use("/cart", cartRouter);

app.listen(port, () => {
  initAdmin();

  console.log("Servidor rodando na porta " + port);
});
