import Redis from "ioredis";
import env from "./dotenv";
import logger from "./logger";

let redisConnection: Redis | null = null;

export const redisConnect = async () => {
    return new Promise<void>((resolve, reject) => {
        try {
            redisConnection = new Redis(env.REDIS_SERVICE_URI, {
                maxRetriesPerRequest: null,
            });
            redisConnection.on("connect", () => {
                logger.info("Redis connected successfully");
                resolve();
            });
            redisConnection.on("error", (error) => {
                logger.error("Redis connection error:", error);
                reject(error);
            });
        } catch (error) {
            logger.error(
                "Failed to connect to Redis:",
                error instanceof Error ? error.message : "Unknown error",
            );
            reject(error);
        }
    });
};

export const getRedisConnection = () => {
    if (!redisConnection) {
        throw new Error("Redis connection has not been established");
    }
    return redisConnection;
};
