/* Gatekeeper for RBAC – usage: role("ADMIN") */
export default (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole)
    return res.status(403).json({ msg: "Forbidden: wrong role" });
  next();
};
