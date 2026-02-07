"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../plugins/prisma"));
const signUpUser = async (req, res) => {
    try {
        const { login, password, fullName, age } = req.body;
        const findUser = await prisma_1.default.user.findFirst({
            where: {
                login: login,
                password: password,
            },
        });
        if (!findUser) {
            res.status(401).send({
                success: false,
                message: "Такой user уже есть!",
            });
            return;
        }
        const data = await prisma_1.default.user.create({
            data: {
                login: login,
                password: password,
                fullName: fullName,
                age: age,
            },
        });
        res.status(200).send({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: `error in signUpUser: ${e}`,
        });
    }
};
const signInUser = async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            res.status(401).send({
                success: false,
                message: "Неверный логин или пароль",
            });
            return;
        }
        const data = await prisma_1.default.user.findFirst({
            where: {
                login: login,
                password: password,
            },
        });
        if (!data) {
            res.status(401).send({
                success: false,
                message: "Неверный логин или пароль",
            });
            return;
        }
        res.status(200).send({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: `error in signInUser: ${e}`,
        });
    }
};
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await prisma_1.default.user.findFirst({
            where: {
                id: +id,
            },
        });
        res.status(200).send({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: `error in getUserById: ${e}`,
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, age } = req.body;
        const data = await prisma_1.default.user.update({
            where: {
                id: +id,
            },
            data: {
                fullName: fullName,
                age: age,
            },
        });
        res.status(200).send({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: `error in updateUser: ${e}`,
        });
    }
};
exports.default = { signUpUser, signInUser, getUserById, updateUser };
