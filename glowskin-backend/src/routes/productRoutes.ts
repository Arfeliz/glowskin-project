import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/",    getAllProducts);
router.get("/:id", getProductById);
router.post("/",       requireAdmin, createProduct);
router.put("/:id",     requireAdmin, updateProduct);
router.delete("/:id",  requireAdmin, deleteProduct);

export default router;
