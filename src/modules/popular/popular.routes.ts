import { Router } from "express";
import popularControllers from "./popular.controllers";

const popularRoutes = Router();

popularRoutes.get("/get", popularControllers.getPopular);
popularRoutes.post("/post", popularControllers.postPopular);
popularRoutes.delete("/delete/:id", popularControllers.deletePopular);
popularRoutes.put("/put", popularControllers.putPopular);

export default popularRoutes;
