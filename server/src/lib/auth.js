import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// A strong secret is mandatory in production; fail fast rather than ship
// with a guessable default that would let anyone forge admin tokens.
const ENV_SECRET = process.env.JWT_SECRET;
if (!ENV_SECRET || ENV_SECRET.length < 16) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET must be set to a strong value (>=16 chars) in production.",
    );
  }
  // eslint-disable-next-line no-console
  console.warn(
    "[auth] JWT_SECRET is missing/weak — using an insecure dev secret. Set JWT_SECRET in server/.env.",
  );
}
const JWT_SECRET =
  ENV_SECRET && ENV_SECRET.length >= 16
    ? ENV_SECRET
    : "dev-insecure-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

export function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Minimum bar for admin/CMS account passwords (AD-004): 12+ chars with
// upper, lower, digit, and symbol. Kept simple/deterministic so both the
// API and any future UI hint can share the same rule description.
const PASSWORD_RULE_MESSAGE =
  "Password must be at least 12 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.";

export function validatePasswordStrength(password) {
  if (typeof password !== "string" || password.length < 12) {
    return { ok: false, message: PASSWORD_RULE_MESSAGE };
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  if (!hasUpper || !hasLower || !hasDigit || !hasSymbol) {
    return { ok: false, message: PASSWORD_RULE_MESSAGE };
  }
  return { ok: true };
}
