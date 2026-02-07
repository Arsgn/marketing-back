"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_prisma_controllers_1 = __importDefault(require("./todo-prisma.controllers"));
const router = (0, express_1.Router)();
router.get("/get-all", todo_prisma_controllers_1.default.getTodos);
router.get("/get/:id", todo_prisma_controllers_1.default.getTodoById);
router.post("/create", todo_prisma_controllers_1.default.createTodo);
router.patch("/update/:id", todo_prisma_controllers_1.default.updateTodo);
router.delete("/delete", todo_prisma_controllers_1.default.deleteTodo);
exports.default = router;
