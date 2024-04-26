import express from "express";
import * as cartController from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", cartController.addToCart);

export default router;
