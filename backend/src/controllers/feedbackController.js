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
