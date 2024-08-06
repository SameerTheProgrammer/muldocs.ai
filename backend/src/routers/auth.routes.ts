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
import {
    IForgotPasswordRequest,
    INewPasswordRequest,
    IResendOtpRequest,
    IUpdateInfoRequest,
    IUserLoginRequest,
    IUserRegisterRequest,
    IVerifyAccountRequest,
    IVerifyOtpRequest,
} from "../types/auth.types";
import {
    forgotPasswordValidation,
    loginValidation,
    newPasswordValidation,
    registerValidation,
    sendOtpValidation,
    updateProfileValidation,
    verifiyOtpValidation,
} from "../validators/auth.validator";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { OtpService } from "./../service/Otp.Service";
import { Otp } from "../entity/Otp";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const otpRepository = AppDataSource.getRepository(Otp);

const userService = new UserService(userRepository);
const otpService = new OtpService(otpRepository);

const authController = new AuthController(userService, logger, otpService);

router
    .route("/register")
    .post(
        registerValidation,
        (req: Request, res: Response, next: NextFunction) => {
            authController.register(
                req as IUserRegisterRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

router
    .route("/login")
    .post(
        loginValidation,
        (req: Request, res: Response, next: NextFunction) => {
            authController.login(
                req as IUserLoginRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

router
    .route("/newPassword")
    .post(
        newPasswordValidation,
        isAuthenticated as unknown as RequestHandler,
        (req: Request, res: Response, next: NextFunction) => {
            authController.newPassword(
                req as INewPasswordRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

router
    .route("/forgot-password")
    .post(
        forgotPasswordValidation,
        (req: Request, res: Response, next: NextFunction) => {
            authController.forgotPassword(
                req as IForgotPasswordRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

router
    .route("/reset-profile")
    .post(
        updateProfileValidation,
        isAuthenticated as unknown as RequestHandler,
        (req: Request, res: Response, next: NextFunction) => {
            authController.updateProfile(
                req as IUpdateInfoRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

router
    .route("/verify")
    .post(
        updateProfileValidation,
        (req: Request, res: Response, next: NextFunction) => {
            authController.verifiyAccount(
                req as IVerifyAccountRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

router
    .route("/resend-otp")
    .post(
        sendOtpValidation,
        (req: Request, res: Response, next: NextFunction) => {
            authController.sendOtp(
                req as IResendOtpRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

router
    .route("/verify-otp")
    .post(
        verifiyOtpValidation,
        (req: Request, res: Response, next: NextFunction) => {
            authController.verifiyOtp(
                req as IVerifyOtpRequest,
                res,
                next,
            ) as unknown as RequestHandler;
        },
    );

export default router;
