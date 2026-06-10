import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  profile,
} from "../controllers/userController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// TEST JWT
router.get("/profile", authenticate, profile);

// CRUD USER
router.get("/", authenticate, getAllUsers);

router.get("/:id", authenticate, getUserById);

router.post("/", authenticate, createUser);

router.put("/:id", authenticate, updateUser);

router.delete("/:id", authenticate, deleteUser);

export default router;