import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const categoryGet = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        populars: true,
      },
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error,
    });
  }
};

const categoryCreate = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

const categoryUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Category успешно удалена",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Ошибка при удалении",
      error: error.message,
    });
  }
};

export default {
  categoryGet,
  categoryCreate,
  categoryUpdate,
  deleteCategory,
};
