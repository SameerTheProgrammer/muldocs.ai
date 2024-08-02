import { Queue } from "bullmq";
import redisConnection from "./redis";

// export const pdfQueue = new Queue("pdfQueue");
const otpNotificationQueue = new Queue("otpNotificationQueue", {
    connection: redisConnection,
});

export default otpNotificationQueue;
