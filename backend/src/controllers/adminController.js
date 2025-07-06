import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import Course from "../models/Course.js";

export const stats = async (_req, res) => {
  const [students, feedbacks, courses] = await Promise.all([
    User.countDocuments(),
    Feedback.countDocuments(),
    Course.countDocuments(),
  ]);
  res.json({ students, feedbacks, courses });
};

