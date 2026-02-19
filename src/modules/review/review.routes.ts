import { Router } from "express";
import reviewControllers from "./review.controllers";

const reviewRoutes = Router();

reviewRoutes.get("/reviews", reviewControllers.getReview);
reviewRoutes.post("/reviews", reviewControllers.postReview);
reviewRoutes.put("/reviews/:id", reviewControllers.putReview);
reviewRoutes.delete("/reviews/:id", reviewControllers.deleteReview);

export default reviewRoutes;
