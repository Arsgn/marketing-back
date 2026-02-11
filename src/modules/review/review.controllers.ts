// GET /reviews

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
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const postReview = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { rating, comment, userId, popularId, availableId } = req.body;

  try {
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        popularId,
        availableId, // бул опционалдуу
      },
    });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const putReview = async (req: Request, res: Response) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { rating, comment, availableId } = req.body;

  try {
    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        rating,
        comment,
        availableId,
      },
    });
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    await prisma.review.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default { getReview, postReview, putReview, deleteReview };
