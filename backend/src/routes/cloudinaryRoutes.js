// import { Router } from "express";
// import cloudinary from "cloudinary";

// const router = Router();

// // configure cloudinary with your credentials (ideally from .env)
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // POST /api/cloudinary/sign
// router.post("/sign", (req, res) => {
//   const timestamp = Math.round(Date.now() / 1000);
//   const folder = req.body.folder || "avatars"; // default folder

//   const signature = cloudinary.v2.utils.api_sign_request(
//     { timestamp, folder },
//     process.env.CLOUDINARY_API_SECRET
//   );

//   res.json({
//     timestamp,
//     folder,
//     signature,
//     apiKey: process.env.CLOUDINARY_API_KEY,
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//   });
// });

// export default router;

import { Router } from "express";
import auth from "../middleware/auth.js";      // optional: JWT protect
import { getSignature } from "../controllers/cloudinaryController.js";

const router = Router();
router.post("/sign", auth, getSignature);

export default router;
