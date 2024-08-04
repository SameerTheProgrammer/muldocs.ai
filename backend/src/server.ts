import app from "./app";
import { AppDataSource } from "./config/data-source";
import env from "./config/dotenv";
import logger from "./config/logger";
import "./config/bullmq";
import { redisConnect } from "./config/redis";

const startServer = async () => {
    const PORT = env.PORT || 8000;

    try {
        await AppDataSource.initialize();
        logger.info(`Database is initialized`);

        redisConnect();

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}..`);
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
