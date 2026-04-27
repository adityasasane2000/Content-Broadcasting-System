import prisma from "../config/prisma.js";

export const createContentSchedule = async ({
    contentId,
    rotationOrder,
    duration,
    user,
}) => {
    const content = await prisma.content.findUnique({
        where: { id: contentId },
    });

    if (!content) {
        throw new Error("Content not found");
    }

    if (content.status !== "APPROVED") {
        throw new Error("Only approved content can be scheduled");
    }

    if (duration <= 0) {
        throw new Error("Duration must be greater than 0");
    }

    if (content.uploadedById !== user.id) {
        throw new Error("You can only schedule your own content");
    }

    const existingOrder = await prisma.contentSchedule.findFirst({
        where: {
            subjectId: content.subjectId,
            rotationOrder,
        },
    });

    if (existingOrder) {
        throw new Error("Rotation order already exists for this subject");
    }

    const schedule = await prisma.contentSchedule.create({
        data: {
            contentId,
            subjectId: content.subjectId,
            rotationOrder,
            duration,
        },
    });

    return schedule;
};