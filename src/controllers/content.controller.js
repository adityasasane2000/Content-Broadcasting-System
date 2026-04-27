import prisma from "../config/prisma.js";
import { getContentService, getLiveContentService, getMyContentService, saveContent, updateContent } from "../services/content.service.js";

export const uploadContent = async (req, res) => {
    try {
        const { title, description, subjectId, startTime, endTime } = req.body;

        if (!title || !subjectId) {
            return res.status(400).json({
                message: "Title and subjectId are required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "File is required",
            });
        }

        const file = req.file;
        const user = req.user;

        const content = await saveContent({ title, description, subjectId, startTime, endTime, file, user });

        return res.status(201).json({
            message: "Content uploaded successfully",
            data: content,
        });
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Upload failed",
        });
    }
};

export const update = async (req, res) => {
    try {
        const { contentId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!contentId) {
            return res.status(400).json({
                message: "ContentId is required",
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
            });
        }

        const updated = await updateContent({ contentId, user: req.user, status, rejectionReason });

        return res.status(200).json({
            message: "Content updated successfully",
            data: updated,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}


export const getLiveContent = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const content = await getLiveContentService(teacherId);

        if (!content) {
            return res.status(404).json({
                message: "No content available",
            });
        }

        return res.status(200).json({
            data: content,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


export const getContent = async (req, res) => {
    try {
        const query = req.query;

        const contents = await getContentService(query);

        return res.status(200).json({
            success: true,
            message: "Content fetched successfully",
            ...contents,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch content",
            error: error.message,
        });
    }
};


export const getMyContent = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = req.query;

        if (!userId) {
            throw new Error("userId is required");
        }

        const contents = await getMyContentService(userId, query);

        return res.status(200).json({
            success: true,
            message: "Content fetched successfully",
            ...contents,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

