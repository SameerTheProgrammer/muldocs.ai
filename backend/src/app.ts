import "reflect-metadata";
import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import createHttpError, { HttpError } from "http-errors";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import morgan from "morgan";
// import csrf from "csurf";
import sanitize from "express-mongo-sanitize";
import logger from "./config/logger";
import { AppDataSource } from "./config/data-source";
import { User } from "./entity/User";

// Initialize Express app
const app = express();

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

interface IUserRegisterRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}

app.post("/api/v1/auth/register", (async (
    req: IUserRegisterRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name, email, password } = req.body;
        logger.info("New request to register a user", {
            name,
            email,
            password: "****",
        });
        const userRepository = AppDataSource.getRepository(User);
        const isUserExist = await userRepository.findOne({ where: { email } });
        if (isUserExist) {
            const error = createHttpError(
                400,
                "Email is already exists. Try with different email",
            );
            return next(error);
        }

        const data = userRepository.create({ name, email, password });
        const newUser = await userRepository.save(data);

        logger.info("User has been registered", { id: newUser.id });
        res.status(201).json({ newUser });
    } catch (error) {
        return next();
    }
}) as RequestHandler);

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
