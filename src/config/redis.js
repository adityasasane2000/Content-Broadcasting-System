import { createClient } from "redis";

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
  });

  await redisClient.connect();
  console.log("Redis connected");
} else {
  console.log("Redis not configured, skipping.");
}

export default redisClient;