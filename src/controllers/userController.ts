import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db.js";

interface AuthenticatedRequest extends Request {
  user?: any;
}

// GET ALL USERS
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        foto: true,
        createdAt: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data user",
      error,
    });
  }
};

// GET USER BY ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        foto: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User tidak ditemukan",
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error,
    });
  }
};

// CREATE USER
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, foto } = req.body;

  if (!name || !email || !password || !foto) {
    res.status(400).json({
      message: "Semua field wajib diisi",
    });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        message: "Email sudah digunakan",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        foto,
      },
    });

    res.status(201).json({
      message: "User berhasil dibuat",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat user",
      error,
    });
  }
};

// UPDATE USER
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const { name, email, password, foto } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (foto) updateData.foto = foto;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: "User berhasil diperbarui",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui user",
      error,
    });
  }
};

// DELETE USER
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus user",
      error,
    });
  }
};

// PROFILE JWT
export const profile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  res.status(200).json({
    message: "Profile berhasil diakses",
    user: req.user,
  });
};