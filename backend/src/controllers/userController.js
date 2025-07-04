import User from "../models/User.js";

export const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find({ role: "STUDENT" }).select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.blocked = !user.blocked;
    await user.save();
    res.json({ msg: `User ${user.blocked ? "blocked" : "unblocked"}` });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    next(err);
  }
};
