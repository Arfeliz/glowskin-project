import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/configController";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/",  getConfig);
router.put("/",  requireAdmin, updateConfig);

export default router;
