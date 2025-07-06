import jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

    const signToken = (user) =>
   jwt.sign(
     { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );


const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;


export const signup = async (req, res, next) => {
  // console.log(" Received body:", req.body);

  try {
    const { name, email, password, role = "STUDENT" } = req.body;
    // console.log("  Extracted role  :", role);  

    if (!emailRegex.test(email)) {
      return next({ status: 400, message: "Invalid email format" });
    }
    if (!passwordRegex.test(password)) {
      return next({
        status: 400,
        message:
          "Password must be at least 8 characters long and include 1 number & 1 special character",
      });
    }

    if (role === "ADMIN") {
      const adminCount = await User.countDocuments({ role: "ADMIN" });
      if (adminCount >= 2) {
        return next({
          status: 400,
          message:
            "Admin capacity reached. Please sign up as a Student instead.",
        });
      }
    }


    const user = await User.create({ name, email, password, role });

    // console.log("✅ Saved user.role  :", user.role);


    res.json({ user, token: signToken(user) });
  } catch (err) {

    next({ status: 400, message: err.message });
  }
};


export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePass(password))) {
      return next({ status: 400, message: "Invalid credentials" });
    }
    res.json({ user, token: signToken(user) });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id); // set by auth middleware

    if (!user || !(await user.comparePass(currentPassword))) {
      return res.status(400).json({ msg: "Invalid current password" });
    }


    if (!passwordRegex.test(newPassword)) {
      return res
        .status(400)
        .json({
          msg:
            "New password must be at least 8 characters long and include 1 number & 1 special character",
        });
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};
