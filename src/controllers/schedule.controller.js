import { createContentSchedule } from "../services/schedule.service.js";

export const createSchedule = async (req, res) => {
  try {
    const { contentId, rotationOrder, duration } = req.body;
    
    if (!contentId || rotationOrder == null || !duration) {
      return res.status(400).json({
        message: "contentId, rotationOrder and duration are required",
      });
    }

    const result = await createContentSchedule({
      contentId,
      rotationOrder,
      duration,
      user: req.user
    });
    
    return res.status(201).json({
      message: "Schedule created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};