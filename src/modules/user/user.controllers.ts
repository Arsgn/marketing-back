import { Request, Response } from "express";
import prisma from "../../plugins/prisma";
import { supabase } from "../../plugins/supabase";
import bcrypt from "bcrypt";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Заполните все поля",
      });
    }

    // 🔐 Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Регистрируем в Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Сохраняем в своей БД
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // 🔥 сохраняем ХЕШ
        name,
        supabaseId: data.user?.id,
      },
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Ошибка регистрации",
    });
  }
};

const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    // 🔐 Сравниваем пароль
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Неверный пароль",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Ошибка входа",
    });
  }
};


const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: String(e),
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      success: false,
      message: "Нет refresh token",
    });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }

  res.status(200).json({
    success: true,
    session: data.session,
  });
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    let dataToUpdate: any = { ...rest };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch {
    res.status(404).json({
      success: false,
      message: "Ошибка обновления",
    });
  }
};

const signOutUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Нет токена",
      });
    }

    const token = authHeader.split(" ")[1];

    const { error } = await supabase.auth.admin.signOut(token);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Выход выполнен",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Ошибка выхода",
    });
  }
};



export { signUpUser, signInUser, refreshToken, getUserById, updateUser, signOutUser };
