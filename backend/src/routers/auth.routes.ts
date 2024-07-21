import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AuthController } from "../controllers/Auth.Controller";
import { UserService } from "./../service/User.Service";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "./../config/logger";
import { IUserRegisterRequest } from "../types/auth.types";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);

const userService = new UserService(userRepository);

const authController = new AuthController(userService, logger);

router
    .route("/register")
    .post((req: Request, res: Response, next: NextFunction) => {
        authController.register(
            req as IUserRegisterRequest,
            res,
            next,
        ) as unknown as RequestHandler;
    });

export default router;
