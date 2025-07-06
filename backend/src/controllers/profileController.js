import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* GET /api/profile */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) { next(err); }
};

/* PUT /api/profile */
export const updateProfile = async (req, res, next) => {
  const { name, phone, dob, address, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, dob, address, avatar },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) { next(err); }
};

/* PATCH /api/profile/password */
export const changePassword = async (req, res, next) => {
  const { current, password } = req.body;
  try {
    const user = await User.findById(req.user.id);

    const ok = await bcrypt.compare(current, user.password);
    if (!ok) return res.status(400).json({ msg: "Current password incorrect" });

    const strong = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(password);
    if (!strong) return res.status(400).json({ msg: "Weak password" });

    user.password = password;   // 🚫 no hashing here
    await user.save();          // pre‑save hook will hash once

    res.json({ msg: "Password updated" });
  } catch (err) {
    next(err);
  }
};
