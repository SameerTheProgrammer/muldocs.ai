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
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("./config/dotenv"));
const logger_1 = __importDefault(require("./config/logger"));
const redis_1 = require("./config/redis");
const sendOtpWorker_1 = require("./worker/sendOtpWorker");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = dotenv_1.default.PORT || 8000;
    try {
        yield (0, redis_1.redisConnect)();
        (0, sendOtpWorker_1.otpWorkerConnect)();
        logger_1.default.info(`OTP worker is initialized`);
        app_1.default.listen(PORT, () => {
            logger_1.default.info(`server is running on port ${PORT}..`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
});
startServer();
