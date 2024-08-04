"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpWorkerConnect = void 0;
const bullmq_1 = require("bullmq");
const logger_1 = __importDefault(require("../config/logger"));
const redis_1 = require("../config/redis");
const mailer_1 = require("../mailer");
const otpWorkerConnect = () => {
    const sendOtpWorker = new bullmq_1.Worker("otpNotificationQueue", (job) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, otp, name } = job.data;
            yield (0, mailer_1.sendVerificationEmail)(email, otp, name);
        }
        catch (error) {
            logger_1.default.error(`Failed to process job ${job.id}: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw error;
        }
    }), { connection: (0, redis_1.getRedisConnection)() });
    sendOtpWorker.on("completed", (job) => {
        logger_1.default.info(`Job with id ${job.id} has been completed`);
    });
    sendOtpWorker.on("failed", (job, err) => {
        logger_1.default.error(`Job with id ${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
    });
};
exports.otpWorkerConnect = otpWorkerConnect;
