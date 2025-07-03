import { Router } from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import { listUsers, blockUser, deleteUser } from "../controllers/userController.js";

const router = Router();

// Admin only routes
router.get("/", auth, role("ADMIN"), listUsers);
router.patch("/:id/block", auth, role("ADMIN"), blockUser);
router.delete("/:id", auth, role("ADMIN"), deleteUser);

export default router;
