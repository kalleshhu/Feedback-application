import { toCSV } from "../utils/csv.js";
import Feedback from "../models/Feedback.js";

/* POST /api/feedback */
export const addFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};

export const listMyFeedback = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const [feedbacks, total] = await Promise.all([
      Feedback.find({ user: req.user.id })
        .populate("course", "title")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),

      Feedback.countDocuments({ user: req.user.id }),
    ]);

    res.json({
      feedbacks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (err) {
    next(err);
  }
};

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

export const updateFeedback = async (req, res, next) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ msg: "Not found" });
    if (fb.user.toString() !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ msg: "Forbidden" });

    fb.rating = req.body.rating ?? fb.rating;
    fb.message = req.body.message ?? fb.message;
    fb.course = req.body.course ?? fb.course;
    await fb.save();
    res.json(fb);
  } catch (err) {
    next(err);
  }
};

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

/* ✅ DELETE /api/feedback/admin/bulk  – ADMIN only */
export const deleteManyFeedbacks = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ msg: "No feedback IDs provided" });

    const result = await Feedback.deleteMany({ _id: { $in: ids } });
    res.json({ msg: `${result.deletedCount} feedback(s) deleted` });
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

export const avgRatings = async (_req, res) => {
  const data = await Feedback.aggregate([
    { $group: { _id: "$course", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    { $project: { _id: 0, course: "$course.title", avg: 1, count: 1 } },
  ]);
  res.json(data);
};
