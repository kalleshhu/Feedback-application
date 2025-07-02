import { Router } from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  listCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = Router();

/* Anyone logged‑in can view courses */
router.get("/", auth, listCourses);

/* Admin‑only CRUD */
router.post("/",    auth, role("ADMIN"), addCourse);
router.put("/:id",  auth, role("ADMIN"), updateCourse);
router.delete("/:id", auth, role("ADMIN"), deleteCourse);

export default router;
