import { Router } from "express";
import chatControllers from "./chat.controllers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/get-all", authMiddleware, chatControllers.getMessages);
router.post("/send", authMiddleware, chatControllers.sendMessage);
router.get("/users", authMiddleware, chatControllers.getUsers);
router.get("/private/:receiverId", authMiddleware, chatControllers.getPrivateMessages);
router.post("/private/send", authMiddleware, chatControllers.sendPrivateMessage);


export default router;
