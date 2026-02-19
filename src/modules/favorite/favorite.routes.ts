import { Router } from "express";
import favoriteControllers from "./favorite.controllers";
import { authMiddleware } from "../../middleware/auth";

const favoriteRoutes = Router();

favoriteRoutes.get("/get", authMiddleware, favoriteControllers.getFavorites);
favoriteRoutes.post("/add", authMiddleware, favoriteControllers.addFavorite);
favoriteRoutes.delete("/remove/:popularId", authMiddleware, favoriteControllers.removeFavorite);

export default favoriteRoutes;