import { verifyToken } from "../lib/auth.js";

// Reads JWT from Authorization header (Bearer) or httpOnly cookie.
export function verifyJwt(req, res, next) {
  let token = null;
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    token = header.slice(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

// Restrict a route to specific roles. Usage: requireRole("SUPER_ADMIN")
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    return next();
  };
}
