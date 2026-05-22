import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. GET ALL PEMBICARA
export const getPembicaras = async (
  req: Request,
  res: Response
) => {

  try {

    const pembicaras =
      await prisma.pembicara.findMany({
        orderBy: {
          id: "desc"
        }
      });

    res.status(200).json(pembicaras);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil data pembicara"
    });

  }

};

// 2. CREATE PEMBICARA
export const createPembicara = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      name,
      role,
      image
    } = req.body;

    // VALIDASI
    if (!name || !role || !image) {
      return res.status(400).json({
        message: "Name, Role dan Image harus diisi"
      });
    }

    // CREATE DATA
    const pembicara =
      await prisma.pembicara.create({
        data: {
          name,
          role,
          image
        }
      });

    res.status(201).json({
      message: "Pembicara berhasil dibuat",
      pembicara
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Gagal create pembicara"
    });

  }

};

// 3. GET DETAIL PEMBICARA
export const getPembicara = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      parseInt(req.params.id as string);

    // VALIDASI ID
    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid"
      });
    }

    const pembicara =
      await prisma.pembicara.findUnique({
        where: {
          id
        }
      });

    // CEK DATA
    if (!pembicara) {
      return res.status(404).json({
        message: "Pembicara tidak ditemukan"
      });
    }

    res.status(200).json(pembicara);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error get pembicara"
    });

  }

};

// 4. UPDATE PEMBICARA
export const updatePembicara = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      parseInt(req.params.id as string);

    // VALIDASI ID
    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid"
      });
    }

    const {
      name,
      role,
      image
    } = req.body;

    // CEK DATA
    const existingPembicara =
      await prisma.pembicara.findUnique({
        where: {
          id
        }
      });

    if (!existingPembicara) {
      return res.status(404).json({
        message: "Pembicara tidak ditemukan"
      });
    }

    // UPDATE DATA
    const pembicara =
      await prisma.pembicara.update({
        where: {
          id
        },
        data: {
          name: name || existingPembicara.name,
          role: role || existingPembicara.role,
          image: image || existingPembicara.image,
        }
      });

    res.status(200).json({
      message: "Pembicara berhasil diupdate",
      pembicara
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error update pembicara"
    });

  }

};

// 5. DELETE PEMBICARA
export const deletePembicara = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      parseInt(req.params.id as string);

    // VALIDASI ID
    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid"
      });
    }

    // CEK DATA
    const pembicara =
      await prisma.pembicara.findUnique({
        where: {
          id
        }
      });

    if (!pembicara) {
      return res.status(404).json({
        message: "Pembicara tidak ditemukan"
      });
    }

    // DELETE DATA
    await prisma.pembicara.delete({
      where: {
        id
      }
    });

    res.status(200).json({
      message: "Pembicara berhasil dihapus"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error delete pembicara"
    });

  }

};