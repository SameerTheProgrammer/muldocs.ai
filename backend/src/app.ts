import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import morgan from "morgan";
// import csrf from "csurf";
import sanitize from "express-mongo-sanitize";
import logger from "./config/logger";
import cookieSession from "cookie-session";
import passport from "passport";
import authRouter from "./routers/auth.routes";
import googleAuthRouter from "./routers/google.auth.routes";
import env from "./config/dotenv";

// Initialize Express app
const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// All security related middlewares
app.use(cors());
app.use(compression());
app.use(cookieParser());
// app.use(csrf({ cookie: true }));
app.use(hpp());
app.use(morgan("combined"));
app.use(sanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [env.COOKIE_KEY],
    }),
);
app.use("/api/v1/auth/google", googleAuthRouter);
app.use("/api/v1/auth", authRouter);

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
