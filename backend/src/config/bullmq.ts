import { Queue, QueueEvents } from "bullmq";
import logger from "./logger";
import { getRedisConnection } from "./redis";

let otpNotificationQueue: Queue | null = null;

export const initQueue = () => {
    const redisConnection = getRedisConnection();

    otpNotificationQueue = new Queue("otpNotificationQueue", {
        connection: redisConnection,
    });

    const queueEvents = new QueueEvents("otpNotificationQueue", {
        connection: redisConnection,
    });

    queueEvents.on("waiting", ({ jobId }) => {
        logger.info(`Job with id ${jobId} is waiting`);
    });

    queueEvents.on("active", ({ jobId, prev }) => {
        logger.info(`Job ${jobId} is now active: previous status was ${prev}`);
    });

    queueEvents.on("completed", ({ jobId, returnvalue }) => {
        logger.info(`Job ${jobId} has completed and returned ${returnvalue}`);
    });

    queueEvents.on("failed", ({ jobId, failedReason }) => {
        logger.info(`Job ${jobId} has failed with reason: ${failedReason}`);
    });

    return otpNotificationQueue;
};

export const addJobToQueue = async (data: {
    email: string;
    otp: string;
    name: string;
}) => {
    if (!otpNotificationQueue) {
        throw new Error("Queue has not been initialized");
    }
    try {
        const job = await otpNotificationQueue.add("sendOTP", data);
        logger.info(`Job added with id ${job.id}`);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Failed to add job: ${error.message}`);
        }
    }
};
