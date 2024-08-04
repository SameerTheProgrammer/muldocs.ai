import Redis from "ioredis";
import env from "./dotenv";
import logger from "./logger";

let redisConnection: Redis | null = null;

export const redisConnect = () => {
    try {
        redisConnection = new Redis(env.REDIS_SERVICE_URI);
        redisConnection.on("connect", () => {
            logger.info("Redis connected successfully");
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error("Failed to connect to Redis:", error.message);
        }
    }
};

export const getRedisConnection = () => {
    if (!redisConnection) {
        throw new Error("Redis connection has not been established");
    }
    return redisConnection;
};
