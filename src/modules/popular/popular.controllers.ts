import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getPopular = async (req: Request, res: Response) => {
  try {
    const popular = await prisma.popular.findMany({
      where: { id: 1 },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        price: true,
        category: true,
        reviews: true,
        favorites: true,
      },
    });

    res.status(200).json({
      success: true,
      data: popular,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error in getPopular: ${error}`,
    });
  }
};

const postPopular = async (req: Request, res: Response) => {
  try {
    const { title, description, image, price, categoryId } = req.body;
    if (!title.trim()) {
      return res.status(401).json({
        success: false,
        message: "Названия обязательное!!!",
      });
    }
    // Проверка: такой тур уже есть?
    const exists = await prisma.popular.findFirst({
      where: { title },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Такой тур уже существует!",
      });
    }

    const addPopular = await prisma.popular.create({
      data: {
        title,
        description,
        image,
        price,
        categoryId,
      },
    });

    return res.status(201).json({
      success: true,
      data: addPopular,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error in postPopular: ${error}`,
    });
  }
};

const deletePopular = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Не передан ID!!!",
      });
    }

    const exists = await prisma.popular.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Product с таким ID не найден!!!",
      });
    }

    const del = await prisma.popular.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Product успешно удалён!!!",
      del,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Ошибка при удалении: ${error}`,
    });
  }
};

const putPopular = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({
        success: false,
        message: "Некорректный ID",
      });
    }

    const id = parseInt(idParam);

    const { title, description, image, price, categoryId } = req.body;

    const exists = await prisma.popular.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Тур с таким ID не найден!",
      });
    }

    const updatedPopular = await prisma.popular.update({
      where: { id },
      data: {
        title,
        description,
        image,
        price: Number(price),
        categoryId: Number(categoryId),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedPopular,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Ошибка при обновлении: ${error}`,
    });
  }
};

export default {
  getPopular,
  postPopular,
  deletePopular,
  putPopular,
};
