import { Router } from "express";
import userRoutes from "../modules/user/user.routes";
import chatRoutes from "../modules/chat/chat.routes";
import reviewRoutes from "../modules/review/review.routes";
import popularRoutes from "../modules/popular/popular.routes";
import availableRoutes from "../modules/available/available.routes";
import notificationRoutes from "../modules/notification/notification.routes";
import categoryRoutes from "../modules/category/category.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/review", reviewRoutes);
router.use("/popular", popularRoutes);
router.use("/available", availableRoutes);
router.use("/notification", notificationRoutes);
router.use("/category", categoryRoutes);

export default router;
