import { Router } from "express";
import auth from "../middleware/auth.js";

import {
  getProfile,
  updateProfile,
  changePassword
} from "../controllers/profileController.js";

const router = Router();
router.use(auth);              // JWT required

router.get("/",    getProfile);
router.put("/",    updateProfile);
router.patch("/password", changePassword);


export default router;
