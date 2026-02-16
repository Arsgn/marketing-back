import { Router } from "express";
import * as userControllers from "./user.controllers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

// Публичные роуты
router.post("/sign-up", userControllers.signUpUser);
router.post("/sign-in", userControllers.signInUser);
router.post("/refresh-token", userControllers.refreshToken);

// Защищенные роуты
router.get("/me", authMiddleware, userControllers.getMe);
router.get("/get/:id", authMiddleware, userControllers.getUserById);
router.post("/sign-out", authMiddleware, userControllers.signOutUser);
router.patch("/update/:id", authMiddleware, userControllers.updateUser);

export default router;
