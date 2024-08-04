import { Queue, QueueEvents } from "bullmq";
import logger from "./logger";
import { getRedisConnection } from "./redis";

const redisConnection = getRedisConnection();

const otpNotificationQueue = new Queue("otpNotificationQueue", {
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

export { otpNotificationQueue };
