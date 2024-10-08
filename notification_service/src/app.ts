import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import logger from "./config/logger";

// Initialize Express app
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to muldocs.ai");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
app.get("/error", async (req: Request, res: Response, next: NextFunction) => {
    const err = createHttpError(
        401,
        "Hey, you don't have permission to access this page",
    );
    return next(err);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        logger.error(err.message);
        const statusCode = err.statusCode || err.status || 500;

        res.status(statusCode).json({
            error: [
                {
                    type: err.name,
                    msg: err.message,
                    path: "",
                    location: "",
                },
            ],
        });
    }
});

export default app;
