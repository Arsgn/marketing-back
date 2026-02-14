import { Response } from "express";
import prisma from "../../plugins/prisma";
import { CustomRequest } from "../../middleware/auth";

const getMessages = async (req: CustomRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка получения сообщений",
    });
  }
};

const sendMessage = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Не авторизован",
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Сообщение не может быть пустым",
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        userId: Number(userId),
        message,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка отправки сообщения",
    });
  }
};

const getUsers = async (req: CustomRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка получения пользователей",
    });
  }
};

const getPrivateMessages = async (req: CustomRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const receiverId = Number(req.params.receiverId);

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Не авторизован",
      });
    }

    const messages = await prisma.privateMessages.findMany({
      where: {
        OR: [
          { senderId: Number(senderId), receiverId },
          { senderId: receiverId, receiverId: Number(senderId) },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка получения приватных сообщений",
    });
  }
};

const sendPrivateMessage = async (req: CustomRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, message } = req.body;

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Не авторизован",
      });
    }

    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: "receiverId и message обязательны",
      });
    }

    const newMessage = await prisma.privateMessages.create({
      data: {
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        message,
      },
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка отправки приватного сообщения",
    });
  }
};

export default {
  getMessages,
  sendMessage,
  getUsers,
  getPrivateMessages,
  sendPrivateMessage,
};
