import express from "express";
import * as productController from "../controllers/product.controllers.js";
import adminLevel from "../middlewares/admin.middleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  // destino de salvamento local das fotos
  destination: function (req, file, cb) {
    cb(null, "./public");
  },

  // nome dado às fotos salvas (data e hora do salvamento)
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }); // para fazer o uploado correto da foto

// os produtos precisam de nivel de administrador para serem criados
// caso o usuário logado seja um administrador, o produto pode ser criado
router.post(
  "/",
  adminLevel,
  upload.single("image"),
  productController.createProduct
);

router.get("/:productId", productController.getProduct);

router.get("/", productController.getProducts);

export default router;
