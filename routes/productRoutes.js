import express from "express";
import { getAllProducts, createProduct, getProductsByFilter } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/filter", getProductsByFilter);

export default router;
