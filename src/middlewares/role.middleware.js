export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized: No user found",
        });
      }

      // check role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden: You do not have permission",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Authorization error",
      });
    }
  };
};