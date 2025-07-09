import { Router } from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  addFeedback,
  listMyFeedback,
  listAllFeedback,
  updateFeedback,
  deleteFeedback,
  deleteManyFeedbacks,
  exportCSV,
  avgRatings,
} from "../controllers/feedbackController.js";

const router = Router();
router.use(auth);                     

/* Student endpoints */
router.post("/", addFeedback);        
router.get("/", listMyFeedback);

router
  .route("/:id")
  .put(updateFeedback)          
  .delete(deleteFeedback);      

router.get("/admin/csv", role("ADMIN"), exportCSV);
router.post("admin/bulk", role("ADMIN"), deleteManyFeedbacks);
router.get("/admin/avg-ratings", role("ADMIN"), avgRatings);

/* Admin endpoint */
router.get("/admin", role("ADMIN"), listAllFeedback);

export default router;
