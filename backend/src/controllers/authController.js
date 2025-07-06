import jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

/* ── regex validators ── */
const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

/* POST /api/auth/signup */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    /* server‑side validation */
    if (!emailRegex.test(email))
      return next({ status: 400, message: "Invalid email format" });

    if (!passwordRegex.test(password))
      return next({
        status: 400,
        message: "Password must be at least 8 characters long and include 1 number & 1 special character"
      });

    const user = await User.create({ name, email, password });
    res.json({ user, token: signToken(user) });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

/* POST /api/auth/login */
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePass(password)))
      return next({ status: 400, message: "Invalid credentials" });

    res.json({ user, token: signToken(user) });
  } catch (err) {
    next(err);
  }
};


export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);  // `req.user` is set by `protect` middleware

    if (!user || !(await user.comparePass(currentPassword))) {
      return res.status(400).json({ msg: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};