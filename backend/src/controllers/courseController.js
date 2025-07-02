import Course from "../models/Course.js";

/* GET /api/courses  (public for logged‑in students) */
export const listCourses = async (_req, res, next) => {
  try {
    const courses = await Course.find().sort("title");
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

/* POST /api/courses  (ADMIN only) */
export const addCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

/* PUT /api/courses/:id  (ADMIN) */
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

/* DELETE /api/courses/:id  (ADMIN) */
export const deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: "Course removed" });
  } catch (err) {
    next(err);
  }
};
