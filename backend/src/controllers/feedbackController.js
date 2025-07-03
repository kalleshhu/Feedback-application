import { toCSV } from "../utils/csv.js";
import Feedback from "../models/Feedback.js";

/* POST /api/feedback
   body: { course, rating, message } */
export const addFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create({
      ...req.body,
      user: req.user.id,      // set from auth middleware
    });
    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};

/* GET /api/feedback  (student – paginated) */
export const listMyFeedback = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const data = await Feedback.find({ user: req.user.id })
      .populate("course", "title")
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort("-createdAt");
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* GET /api/feedback/admin  (ADMIN – filterable) */
export const listAllFeedback = async (req, res, next) => {
  const { course, rating, student } = req.query;
  const filter = {
    ...(course && { course }),
    ...(rating && { rating }),
    ...(student && { user: student }),
  };
  try {
    const data = await Feedback.find(filter)
      .populate("course", "title")
      .populate("user", "name email")
      .sort("-createdAt");
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* PUT /api/feedback/:id  – student can edit own feedback */
export const updateFeedback = async (req, res, next) => {
  try {
    // Find the feedback and be sure the owner matches
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ msg: "Not found" });
    if (fb.user.toString() !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ msg: "Forbidden" });

    fb.rating   = req.body.rating   ?? fb.rating;
    fb.message  = req.body.message  ?? fb.message;
    fb.course   = req.body.course   ?? fb.course;
    await fb.save();
    res.json(fb);
  } catch (err) {
    next(err);
  }
};

/* DELETE /api/feedback/:id  – student can delete own feedback */
export const deleteFeedback = async (req, res, next) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ msg: "Not found" });
    if (fb.user.toString() !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ msg: "Forbidden" });

    await fb.deleteOne();
    res.json({ msg: "Feedback removed" });
  } catch (err) {
    next(err);
  }
};

export const exportCSV = async (req, res) => {
  const fb = await Feedback.find(req.query)
    .populate("course", "title")
    .populate("user", "name email");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=feedback.csv");
  res.send(toCSV(fb));
};

/* Avg rating per course */
export const avgRatings = async (_req, res) => {
  const data = await Feedback.aggregate([
    { $group: { _id: "$course", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    { $project: { _id: 0, course: "$course.title", avg: 1, count: 1 } }
  ]);
  res.json(data);
};
