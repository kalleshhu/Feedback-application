import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ─────────────────────────────────────────────────────────
   Helper: create JWT
   ───────────────────────────────────────────────────────── */
const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

/* ─────────────────────────────────────────────────────────
   POST /api/auth/signup
   ───────────────────────────────────────────────────────── */
export const signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);          // validation handled by Mongoose
    res.json({ user, token: signToken(user) });        // send JWT + user
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────
   POST /api/auth/login
   ───────────────────────────────────────────────────────── */
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePass(password)))
    return next({ status: 400, message: "Invalid credentials" });

  res.json({ user, token: signToken(user) });
};
