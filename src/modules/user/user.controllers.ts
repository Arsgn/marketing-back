import { Request, Response } from "express";
import prisma from "../../plugins/prisma";
import { supabase } from "../../plugins/supabase";
import { CustomRequest } from "../../middleware/auth";

// Получить текущего пользователя (новый эндпоинт)
const getMe = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        error: "Не авторизован",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
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
    console.error("Ошибка при получении текущего пользователя:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

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

    // Регистрация в Supabase с автоподтверждением
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null,
          avatar: avatar || null,
        },
      },
    });

    if (authError) {
      res.status(400).json({
        success: false,
        error: authError.message,
      });
      return;
    }

    if (!authData.user) {
      res.status(400).json({
        success: false,
        error: "Ошибка создания пользователя",
      });
      return;
    }

    // Проверяем, существует ли пользователь в БД
    let user = await prisma.user.findUnique({
      where: { supabaseId: authData.user.id },
    });

    // Если пользователь не существует, создаем его
    if (!user) {
      user = await prisma.user.create({
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
          updatedAt: true,
        },
      });
    }

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

    // Вход через Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      res.status(401).json({
        success: false,
        error: "Неверный email или пароль",
      });
      return;
    }

    if (!authData.user) {
      res.status(401).json({
        success: false,
        error: "Ошибка входа",
      });
      return;
    }

    // Получаем или создаем пользователя в БД
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
          updatedAt: true,
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
        error: "Невалидный refresh token",
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

    // Проверка прав доступа
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
  getMe,
  getUserById,
  signUpUser,
  signInUser,
  refreshToken,
  signOutUser,
  updateUser,
};