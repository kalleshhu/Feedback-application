import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import auth from "./middleware/auth.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes  from "./routes/profileRoutes.js";
import cloudinaryRoutes from "./routes/cloudinaryRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors(), express.json(), morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", auth, adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);


app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ msg: err.message || "Server error" });
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
);
