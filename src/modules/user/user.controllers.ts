import { Request, Response } from "express";
import prisma from "../../plugins/prisma";
import { supabase } from "../../plugins/supabase";
import { CustomRequest } from "../../middleware/auth";

const getUserById = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        supabaseId: true,
        email: true,
        name: true,
        avatar: true,
        agreed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: "Пользователь не найден",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

const signUpUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, avatar } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email и пароль обязательны",
      });
      return;
    }

    // Регистрация в Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      res.status(400).json({
        success: false,
        error: authError?.message || "Ошибка регистрации",
      });
      return;
    }

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { supabaseId: authData.user.id },
    });

    if (existingUser) {
      res.status(200).json({
        success: true,
        data: {
          user: existingUser,
          session: authData.session,
        },
      });
      return;
    }

    // Создание пользователя в базе данных
    const user = await prisma.user.create({
      data: {
        supabaseId: authData.user.id,
        email: authData.user.email!,
        name: name || null,
        avatar: avatar || null,
        agreed: false,
      },
      select: {
        id: true,
        supabaseId: true,
        email: true,
        name: true,
        avatar: true,
        agreed: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        session: authData.session,
      },
    });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

const signInUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email и пароль обязательны",
      });
      return;
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      res.status(401).json({
        success: false,
        error: authError?.message || "Неверный email или пароль",
      });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { supabaseId: authData.user.id },
      select: {
        id: true,
        supabaseId: true,
        email: true,
        name: true,
        avatar: true,
        agreed: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          supabaseId: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name || null,
          avatar: authData.user.user_metadata?.avatar || null,
          agreed: false,
        },
        select: {
          id: true,
          supabaseId: true,
          email: true,
          name: true,
          avatar: true,
          agreed: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        session: authData.session,
      },
    });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: "Refresh token обязателен",
      });
      return;
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      res.status(401).json({
        success: false,
        error: error?.message || "Невалидный refresh token",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        session: data.session,
      },
    });
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

const signOutUser = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.substring(7);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Ошибка Supabase signOut:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Успешный выход",
    });
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

const updateUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, avatar, agreed } = req.body;

    if (req.user?.id !== id) {
      res.status(403).json({
        success: false,
        error: "Доступ запрещен",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(agreed !== undefined && { agreed }),
      },
      select: {
        id: true,
        supabaseId: true,
        email: true,
        name: true,
        avatar: true,
        agreed: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

export {
  getUserById,
  signUpUser,
  signInUser,
  refreshToken,
  signOutUser,
  updateUser,
};
