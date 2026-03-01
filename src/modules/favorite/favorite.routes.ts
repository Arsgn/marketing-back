import { Router } from "express";
import favoriteControllers from "./favorite.controllers";

const favoriteRoutes = Router();

favoriteRoutes.post("/popular/:id/favorite");

favoriteRoutes.get("/get/:id/favorite");

export default favoriteRoutes;
