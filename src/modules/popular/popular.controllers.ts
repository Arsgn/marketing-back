import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getPopularById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const popular = await prisma.popular.findUnique({
      where: { id },
    });

    if (!popular) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      success: true,
      data: popular,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPopular = async (req: Request, res: Response) => {
  try {
    const popular = await prisma.popular.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        price: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: true,
        favorites: true,
      },
    });

    res.status(200).json({
      success: true,
      data: popular,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: `Error in getPopular: ${error}`,
    });
  }
};

const postPopular = async (req: Request, res: Response) => {
  try {
    let { title, description, image, price, categoryId } = req.body;

    price = Number(price);
    if (!title || !description || isNaN(price)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const addPopular = await prisma.popular.create({
      data: {
        title,
        description,
        price,
        image,
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
  const { id } = req.params;

  const product = await prisma.popular.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product с таким ID не найден!!!",
    });
  }

  await prisma.popular.delete({
    where: { id: Number(id) },
  });

  return res.status(200).json({
    success: true,
    message: "Product успешно удален",
  });
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
  getPopularById,
};
