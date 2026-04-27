import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getContent, getLiveContent, getMyContent, reject, update, uploadContent } from "../controllers/content.controller.js";
import { createSchedule } from "../controllers/schedule.controller.js";
import { publicLimiter } from "../utils/rateLimit.js";

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  authorizeRoles("TEACHER"),
  upload.single("file"),
  uploadContent
);


router.patch(
  "/:contentId",
  authenticate,
  authorizeRoles("PRINCIPAL"),
  update
);

router.post(
  "/schedule",
  authenticate,
  authorizeRoles("TEACHER"),
  createSchedule
);


router.get("/live/:teacherId",
  publicLimiter,
  getLiveContent
);


router.get(
  "/",
  authenticate,
  authorizeRoles("PRINCIPAL"),
  getContent
);


router.get(
  "/my",
  authenticate,
  authorizeRoles("TEACHER"),
  getMyContent
);


export default router;