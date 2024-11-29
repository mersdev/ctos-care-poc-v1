import { Router } from "express";
import { profileController } from "../controllers/profileController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/profile", authMiddleware, profileController.getProfile as any);
router.post("/profile", authMiddleware, profileController.createProfile as any);
router.put("/profile", authMiddleware, profileController.updateProfile as any);
router.delete(
  "/profile",
  authMiddleware,
  profileController.deleteProfile as any
);

export default router;
