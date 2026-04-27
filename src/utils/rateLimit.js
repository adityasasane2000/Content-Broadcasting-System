import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: "Too many login attempts. Try later.",
});

export const publicLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 20,
  message: "Too many requests. Please slow down.",
});