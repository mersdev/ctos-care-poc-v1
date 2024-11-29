import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/signout", authController.signOut);
router.post("/reset-password", authController.resetPassword);

export default router;
