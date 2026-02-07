"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const todo_routes_1 = __importDefault(require("../modules/todo/todo.routes"));
const todo_prisma_routes_1 = __importDefault(require("../modules/todo-prisma/todo-prisma.routes"));
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const configCors = {
    origin: [
        "http://localhost:3000",
        "https://motion.kg",
        "https://elcho.dev",
        "https://isa.dev",
    ],
};
const router = (0, express_1.Router)();
router.use("/user", (0, cors_1.default)(configCors), user_routes_1.default);
router.use("/todo", (0, cors_1.default)(configCors), todo_routes_1.default);
router.use("/todo-prisma", (0, cors_1.default)(configCors), todo_prisma_routes_1.default);
exports.default = router;
