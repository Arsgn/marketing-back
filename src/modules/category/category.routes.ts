import { Router } from "express";
import categoryC from "./category.controllers";

const Crouter = Router();

Crouter.get("/get", categoryC.categoryGet);
Crouter.post("/create", categoryC.categoryCreate);
Crouter.delete("/delete/:id", categoryC.deleteCategory);

export default Crouter;
