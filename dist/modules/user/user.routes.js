"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("./user.controllers"));
const router = (0, express_1.Router)();
router.get("/get/:id", user_controllers_1.default.getUserById);
router.post("/sign-up", user_controllers_1.default.signUpUser);
router.post("/sign-in", user_controllers_1.default.signInUser);
router.patch("/update/:id", user_controllers_1.default.updateUser);
exports.default = router;
