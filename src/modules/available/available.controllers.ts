import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getAvailable = async (req: Request, res: Response) => {
  try {
    const getProduct = await prisma.available.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        price: true,
        reviews: true, // эгер relation болсо
        favorites: true, // эгер relation болсо
      },
    });

    res.status(200).json({
      success: true,
      data: getProduct,
    });
  } catch (error) {
    console.log(error); // ката болсо консолго чыгарат
    res.status(500).json({
      success: false,
      error: `Error in:getAvailable`,
    });
  }
};

const postAvailable = async (req: Request, res: Response) => {
  try {
    const { title, description, price, image } = req.body;

    const newProduct = await prisma.available.create({
      data: {
        title,
        description,
        price,
        image,
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        price: true,
        reviews: true,
        favorites: true,
      },
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error in postAvailable",
    });
  }
};

const deleteAvailable = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Не передан ID!!!",
      });
    }

    const exists = await prisma.available.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Product с таким ID не найден!!!",
      });
    }

    const del = await prisma.available.delete({
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

const putAvailable = async (req: Request, res: Response) => {
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

    const exists = await prisma.available.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Тур с таким ID не найден!",
      });
    }

    const updatedPopular = await prisma.available.update({
      where: { id },
      data: {
        title,
        description,
        image,
        price: Number(price),
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

const getAvailableById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 🔒 ID текшерүү
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const available = await prisma.available.findUnique({
      where: { id },
      include: {
        reviews: true,
        favorites: true,
      },
    });

    if (!available) {
      return res.status(404).json({
        success: false,
        message: "Available not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: available,
    });
  } catch (error) {
    console.error("getAvailableById error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default {
  getAvailable,
  postAvailable,
  deleteAvailable,
  putAvailable,
  getAvailableById,
};
