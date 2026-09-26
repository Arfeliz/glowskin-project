import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import {
  deleteProductImage,
  listProductImages,
  uploadProductImage,
} from "../controllers/imageController";
import { requireAdmin } from "../middleware/auth";

const router = Router();
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const receiveImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(new Error("Formato no permitido. Usa JPG, PNG, WebP o GIF"));
      return;
    }
    callback(null, true);
  },
}).single("image");

function handleImageUpload(req: Request, res: Response, next: NextFunction): void {
  receiveImage(req, res, (error: unknown) => {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  });
}

router.get("/", requireAdmin, listProductImages);
router.post("/", requireAdmin, handleImageUpload, uploadProductImage);
router.delete("/", requireAdmin, deleteProductImage);

export default router;