import { Queue } from "bullmq";
import redisConnection from "./redis";

const otpNotificationQueue = new Queue("otpNotificationQueue", {
    connection: redisConnection,
});

export default otpNotificationQueue;
