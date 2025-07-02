import { Router } from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  addFeedback,
  listMyFeedback,
  listAllFeedback,
} from "../controllers/feedbackController.js";

const router = Router();
router.use(auth);                     // all routes below require auth

/* Student endpoints */
router.post("/", addFeedback);        // POST /api/feedback
router.get("/",  listMyFeedback);     // GET  /api/feedback?page=1&limit=10

/* Admin endpoint */
router.get("/admin", role("ADMIN"), listAllFeedback);

export default router;
