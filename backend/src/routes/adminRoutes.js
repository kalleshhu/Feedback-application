// routes/adminRoutes.js
import { Router } from "express";
import role from "../middleware/role.js";
import { stats } from "../controllers/adminController.js";
// import { listUsers, toggleBlock, deleteUser } from "../controllers/userController.js";
import { listUsers, blockUser, deleteUser } from "../controllers/userController.js";

const r = Router();
r.use(role("ADMIN"));
r.get("/stats", stats);
r.get("/users", listUsers);
r.patch("/users/:id/block", blockUser);
r.delete("/users/:id", deleteUser);
export default r;
