import { Router } from "express";
import categoryControllers from "./category.controllers";

const categoryRoutes = Router();
categoryRoutes.get("/get", categoryControllers.getCategories);
categoryRoutes.post("/post", categoryControllers.postCategory);
export default categoryRoutes;
