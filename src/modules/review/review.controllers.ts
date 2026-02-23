import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getReview = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        popular: true,
        available: true,
      },
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const postReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, userId, popularId, availableId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_popularId: {
          userId,
          popularId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,

    return res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const putReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const updated = await prisma.review.update({
      where: { id: Number(id) },
      data: {

      },
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await prisma.review.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export default { getReview, postReview, putReview, deleteReview };
