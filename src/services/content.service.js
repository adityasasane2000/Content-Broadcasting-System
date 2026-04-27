import prisma from "../config/prisma.js";
import redisClient from "../config/redis.js";

export const saveContent = async ({ title, description, subjectId, startTime, endTime, file, user }) => {

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId }
  });

  if (!subject) {
    throw new Error("Invalid subject");
  }

  if (startTime && endTime && new Date(startTime) > new Date(endTime)) {
    throw new Error("Start time cannot be after end time");
  }

  const content = await prisma.content.create({
    data: {
      title,
      description,
      subjectId,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedById: user.id,
      status: "PENDING",
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
    },
  });

  return content;
}



export const updateContent = async ({
  contentId,
  user,
  status,
  rejectionReason,
}) => {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
  });

  if (!content) {
    throw new Error("Content not found");
  }

  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid status");
  }

  if (status === "REJECTED" && !rejectionReason) {
    throw new Error("Rejection reason is required");
  }

  const updateData = {
    status,
    approvedById: user.id,
  };

  if (status === "APPROVED") {
    updateData.approvedAt = new Date();
    updateData.rejectionReason = null;
  }

  if (status === "REJECTED") {
    updateData.rejectionReason = rejectionReason;
    updateData.approvedAt = null;
  }

  const updated = await prisma.content.update({
    where: { id: contentId },
    data: updateData,
  });

  return updated;
};



export const getLiveContentService = async (teacherId) => {

  const cacheKey = `live:${teacherId}`;

  if (redisClient) {
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log("cache hit");
      return JSON.parse(cached);
    }

    console.log("cache miss");
  }

  const now = new Date();

  const contents = await prisma.content.findMany({
    where: {
      uploadedById: teacherId,
      status: "APPROVED",
      startTime: { lte: now },
      endTime: { gte: now },
    },
    include: {
      schedules: true,
    },
  });

  if (!contents.length) return null;

  const scheduleList = contents
    .flatMap((content) =>
      content.schedules.map((s) => ({
        content,
        rotationOrder: s.rotationOrder,
        duration: s.duration,
      }))
    );

  if (!scheduleList.length) return null;

  scheduleList.sort((a, b) => a.rotationOrder - b.rotationOrder);

  const totalDuration = scheduleList.reduce(
    (sum, item) => sum + item.duration,
    0
  );

  const currentTime = Math.floor(Date.now() / 1000);
  const timeInCycle = currentTime % totalDuration;

  let cumulative = 0;
  let activeContent = null;

  for (let item of scheduleList) {
    cumulative += item.duration;

    if (timeInCycle < cumulative) {
      activeContent = item.content;
      break; 
    }
  }

  if (redisClient && activeContent) {
    await redisClient.setEx(cacheKey, 10, JSON.stringify(activeContent));
  }

  return activeContent;
};


export const getContentService = async (query) => {

  let {
    status,
    subjectId,
    teacherId,
    page = 1,
    limit = 10,
  } = query;

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {};

  if (status) filter.status = status;
  if (subjectId) filter.subjectId = subjectId;
  if (teacherId) filter.uploadedById = teacherId;

  const total = await prisma.content.count({
    where: filter,
  });

  const data = await prisma.content.findMany({
    where: filter,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: {
        select: { id: true, name: true },
      },
    },
  });

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};



export const getMyContentService = async (userId, query) => {

  let { status, page = 1, limit = 10 } = query;

  page = Number(page);
  limit = Number(limit);


  const filter = {};
  if (status) filter.status = status;

  const total = await prisma.content.count({
    where: filter
  });

  const skip = (page - 1) * limit;

  const contents = await prisma.content.findMany({
    where: filter,
    skip: skip,
    take: limit,
    orderBy: { createdAt: "desc" }
  });

  return {
    contents,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit)
    }
  };
};
