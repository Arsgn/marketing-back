import { Router } from "express";
import notificationControllers from "./notification.controllers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/", authMiddleware, notificationControllers.getNotifications);
router.patch("/read", authMiddleware, notificationControllers.markAsRead);

export default router;
