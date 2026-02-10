import { Router } from "express";
import userRoutes from "../modules/user/user.routes";
import chatRoutes from "../modules/chat/chat.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/chat", chatRoutes);

export default router;

