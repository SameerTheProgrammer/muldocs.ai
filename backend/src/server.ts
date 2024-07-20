import app from "./app";
import { AppDataSource } from "./config/data-source";
import env from "./config/dotenv";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = env.PORT || 8000;

    try {
        await AppDataSource.initialize();
        logger.info(`Database is initialized`);
        app.listen(PORT, () => {
            logger.info(`server is running on port ${PORT}..`);
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
