import { Response } from "express";
import prisma from "../../plugins/prisma";
import { CustomRequest } from "../../middleware/auth";

const getNotifications = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Не авторизован",
      });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: Number(userId),
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка получения уведомлений",
    });
  }
};

const markAsRead = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Не авторизован",
      });
    }

    await prisma.notification.updateMany({
      where: {
        userId: Number(userId),
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Все уведомления прочитаны",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка обновления уведомлений",
    });
  }
};

export default { getNotifications, markAsRead };