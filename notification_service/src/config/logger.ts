import winston from "winston";
import env from "./dotenv";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            level: "info",
            silent: env.NODE_ENV == "test",
        }),
    ],
});

export default logger;
