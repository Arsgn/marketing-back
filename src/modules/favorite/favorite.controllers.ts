// favorite.controllers.ts
import { Response } from "express";
import prisma from "../../plugins/prisma";
import { CustomRequest } from "../../middleware/auth";

// Получить избранные курсы пользователя   
const getFavorites = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = Number(req.user?.id);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        popular: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            price: true,
            categoryId: true,
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error}` });
  }
};

// Добавить в избранное
const addFavorite = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = Number(req.user?.id);
    const { popularId } = req.body;

    const existing = await prisma.favorite.findUnique({
      where: { userId_popularId: { userId, popularId: Number(popularId) } },
    });

    if (existing) {
      res.status(400).json({ success: false, error: "Уже в избранном" });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: { userId, popularId: Number(popularId) },
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error}` });
  }
};

// Удалить из избранного
const removeFavorite = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = Number(req.user?.id);
    const popularId = Number(req.params.popularId);

    const existing = await prisma.favorite.findUnique({
      where: { userId_popularId: { userId, popularId } },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: "Не найдено в избранном" });
      return;
    }

    await prisma.favorite.delete({
      where: { userId_popularId: { userId, popularId } },
    });

    res.status(200).json({ success: true, message: "Удалено из избранного" });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error}` });
  }
};

export default { getFavorites, addFavorite, removeFavorite };