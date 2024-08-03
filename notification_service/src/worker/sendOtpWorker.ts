import { Worker, Job } from "bullmq";
import logger from "../config/logger";
import redisConnection from "../config/redis";
import { sendVerificationEmail } from "../mailer";

type jobData = {
    email: string;
    otp: string;
    name: string;
};

const sendOtpWorker = new Worker(
    "otpNotificationQueue",
    async (job: Job) => {
        try {
            const { email, otp, name } = job.data as jobData;
            await sendVerificationEmail(email, otp, name);
        } catch (error) {
            return error;
        }
    },
    { connection: redisConnection },
);

sendOtpWorker.on("completed", (job) => {
    logger.info(`Job with id ${job.id} has been completed`);
});

sendOtpWorker.on("failed", (job, err) => {
    logger.info(`Job with id ${job?.id} has failed with ${err.message}`);
});

export { sendOtpWorker };
