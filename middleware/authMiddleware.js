import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // ✅ Read token from cookie instead of Authorization header
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
// middleware/roleCheck.js
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1️⃣ Check if user exists (authenticated)
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // 2️⃣ Normalize roles: remove spaces and convert to lowercase
      const userRoleNormalized = req.user.role.replace(/\s+/g, '').toLowerCase();
      const allowedRolesNormalized = allowedRoles.map(role =>
        role.replace(/\s+/g, '').toLowerCase()
      );

      // 3️⃣ Check if user's role is allowed
      if (!allowedRolesNormalized.includes(userRoleNormalized)) {
        return res.status(403).json({ message: "Not authorized for this action" });
      }

      // ✅ User has permission
      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      res.status(500).json({ message: "Server error during role authorization" });
    }
  };
};

