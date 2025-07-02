import jwt from "jsonwebtoken";

/* Verifies JWT and attaches user payload to req.user */
export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid or expired" });
  }
}
