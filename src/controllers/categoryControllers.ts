import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. menampilkan semua category
export const getCategories = async (
    req: Request,
    res: Response
) => {
    try {

        const categories =
            await prisma.category.findMany();

        res.status(200).json(categories);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Gagal mengambil data category"
        });

    }
};

// 2. menambahkan category
export const createCategory = async (
    req: Request,
    res: Response
) => {

    try {

        const { name } = req.body;

        // validasi sederhana
        if (!name) {
            return res.status(400).json({
                message: "Name harus diisi"
            });
        }

        // simpan ke database
        const category =
            await prisma.category.create({
                data: {
                    name,
                    createdAt: new Date()
                }
            });

        res.status(201).json({
            message: "Data berhasil disimpan",
            category
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Gagal create category"
        });

    }
};

// 3. menampilkan detail category berdasarkan id
export const getCategory = async (
    req: Request,
    res: Response
) => {

    try {

        const id = parseInt(req.params.id as string, 10);

        const category =
            await prisma.category.findUnique({
                where: {
                    id
                }
            });

        if (!category) {
            return res.status(404).json({
                message: "Category tidak ditemukan"
            });
        }

        res.status(200).json(category);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error"
        });

    }
};

// 4. update category
export const updateCategory = async (
    req: Request,
    res: Response
) => {

    try {

        const id = parseInt(req.params.id as string, 10);

        const { name } = req.body;

        const category =
            await prisma.category.update({
                where: {
                    id
                },
                data: {
                    name
                }
            });

        res.status(200).json({
            message: "Category berhasil diupdate",
            category
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error update category"
        });

    }
};

// 5. delete category
export const deleteCategory = async (
    req: Request,
    res: Response
) => {

    try {

        const id = parseInt(req.params.id as string, 10);

        await prisma.category.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            message: "Category berhasil dihapus"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error delete category"
        });

    }
};