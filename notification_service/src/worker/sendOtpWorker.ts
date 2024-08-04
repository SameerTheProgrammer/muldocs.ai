import { Worker, Job } from "bullmq";
import logger from "../config/logger";
import { getRedisConnection } from "../config/redis";
import { sendVerificationEmail } from "../mailer";

type JobData = {
    email: string;
    otp: string;
    name: string;
};

export const otpWorkerConnect = () => {
    const sendOtpWorker = new Worker(
        "otpNotificationQueue",
        async (job: Job) => {
            try {
                const { email, otp, name } = job.data as JobData;
                await sendVerificationEmail(email, otp, name);
            } catch (error) {
                logger.error(
                    `Failed to process job ${job.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
                );
                throw error; // Make sure to rethrow to mark the job as failed
            }
        },
        { connection: getRedisConnection() },
    );

    sendOtpWorker.on("completed", (job) => {
        logger.info(`Job with id ${job.id} has been completed`);
    });

    sendOtpWorker.on("failed", (job, err) => {
        logger.error(`Job with id ${job?.id} has failed with ${err.message}`);
    });
};
