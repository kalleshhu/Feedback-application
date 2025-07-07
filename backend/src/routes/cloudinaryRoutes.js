import { Router } from "express";
import auth from "../middleware/auth.js";      // optional: JWT protect
import { getSignature } from "../controllers/cloudinaryController.js";

const router = Router();
router.post("/sign", auth, getSignature);

export default router;
