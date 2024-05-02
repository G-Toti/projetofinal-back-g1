import express from "express";
import * as cartController from "../controllers/cart.controller.js";

const router = express.Router();

router.put("/add", cartController.addToCart);
router.put("/remove", cartController.removeFromCart);
router.put("/sell", cartController.sellProduct);

export default router;
