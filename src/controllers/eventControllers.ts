import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. menampilkan semua data event
export const getEvents = async (
    req: Request,
    res: Response
) => {

    try {

        const events =
            await prisma.event.findMany({

                include: {
                    category: true,
                    pembicara: true
                }

            });

        res.status(200).json(events);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Gagal mengambil data event"
        });

    }

};

// 2. menambahkan data event
export const createEvent = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            name,
            categoryId,
            pembicaraId,
            location,
            dateEvent,
            description
        } = req.body;

        // validasi
        if (
            !name ||
            !categoryId ||
            !pembicaraId ||
            !location ||
            !dateEvent
        ) {
            return res.status(400).json({
                message: "Data event belum lengkap"
            });
        }

        // simpan database
        const event =
            await prisma.event.create({

                data: {
                    name,
                    categoryId,
                    pembicaraId,
                    location,
                    dateEvent,
                    description
                }

            });

        res.status(201).json({
            message: "Data berhasil disimpan",
            event
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Gagal create event"
        });

    }

};

// 3. detail event
export const showEvent = async (
    req: Request,
    res: Response
) => {

    try {

        const id = parseInt(req.params.id as string);

        const event =
            await prisma.event.findUnique({

                where: {
                    id
                },

                include: {
                    category: true,
                    pembicara: true
                }

            });

        if (!event) {
            return res.status(404).json({
                message: "Data event tidak ditemukan"
            });
        }

        res.status(200).json(event);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error"
        });

    }

};

// 4. update event
export const updateEvent = async (
    req: Request,
    res: Response
) => {

    try {

        const id = parseInt(req.params.id as string);

        const {
            name,
            categoryId,
            pembicaraId,
            location,
            dateEvent,
            description
        } = req.body;

        const event =
            await prisma.event.update({

                where: {
                    id
                },

                data: {
                    name,
                    categoryId,
                    pembicaraId,
                    location,
                    dateEvent,
                    description
                }

            });

        res.status(200).json({
            message: "Data berhasil diupdate",
            event
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error update event"
        });

    }

};

// 5. delete event
export const deleteEvent = async (
    req: Request,
    res: Response
) => {

    try {

        const id = parseInt(req.params.id as string);

        await prisma.event.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            message: "Data berhasil dihapus"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error delete event"
        });

    }

};