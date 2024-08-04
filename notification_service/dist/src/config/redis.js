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
exports.getRedisConnection = exports.redisConnect = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("./dotenv"));
const logger_1 = __importDefault(require("./logger"));
let redisConnection = null;
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            redisConnection = new ioredis_1.default(dotenv_1.default.REDIS_SERVICE_URI, {
                maxRetriesPerRequest: null,
            });
            redisConnection.on("connect", () => {
                logger_1.default.info("Redis connected successfully");
                resolve();
            });
            redisConnection.on("error", (error) => {
                logger_1.default.error("Redis connection error:", error);
                reject(error);
            });
        }
        catch (error) {
            logger_1.default.error("Failed to connect to Redis:", error instanceof Error ? error.message : "Unknown error");
            reject(error);
        }
    });
});
exports.redisConnect = redisConnect;
const getRedisConnection = () => {
    if (!redisConnection) {
        throw new Error("Redis connection has not been established");
    }
    return redisConnection;
};
exports.getRedisConnection = getRedisConnection;
