import { Router } from "express";
import availableControllers from "./available.controllers";

const availableRoutes = Router();

availableRoutes.get("/get", availableControllers.getAvailable);
availableRoutes.get("/:id", availableControllers.getAvailableById);
availableRoutes.post("/post", availableControllers.postAvailable);
availableRoutes.put("/put", availableControllers.putAvailable);
availableRoutes.delete("/delete/:id", availableControllers.deleteAvailable);

export default availableRoutes;
