import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        populars: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const postCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const exists = await prisma.category.findUnique({
      where: { name },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export default { postCategory, getCategories };
