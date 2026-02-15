import { Router } from "express";
import reviewControllers from "./review.controllers";

const reviewRoutes = Router();
reviewRoutes.get("/get", reviewControllers.getReview);
reviewRoutes.post("/post", reviewControllers.postReview);
reviewRoutes.delete("/delete/:id", reviewControllers.deleteReview);
reviewRoutes.put("/put", reviewControllers.putReview);

export default reviewRoutes;
