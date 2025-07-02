import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
