import { Router } from "express";
import categoryControllers from "./category.controllers";

const categoryRoutes = Router();
categoryRoutes.get("/get", categoryControllers.getCategories);
categoryRoutes.post("/post", categoryControllers.postCategory);
categoryRoutes.put("/put/:id", categoryControllers.updateCategory);
categoryRoutes.delete("/delete/:id", categoryControllers.deleteCategory);

export default categoryRoutes;

