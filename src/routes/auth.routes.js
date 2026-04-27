import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../utils/rateLimit.js";

const router = express.Router();


router.post("/register",authLimiter,  register);
router.post("/login", authLimiter, login);


// router.get("/me", authenticate, getMe);

export default router;