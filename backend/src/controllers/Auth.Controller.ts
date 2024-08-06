import { NextFunction, Response } from "express";
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
import { Logger } from "winston";
import { UserService } from "../service/User.Service";
import { setCookie } from "../utils/cookie";
import createHttpError from "http-errors";
import { validateRequest } from "../utils/validation.util";
import { comparePassword } from "../utils/bcrypt.util";
import { OtpService } from "../service/Otp.Service";
import { addJobToQueue } from "../config/bullmq";

export class AuthController {
    constructor(
        private UserService: UserService,
        private logger: Logger,
        private otpService: OtpService,
    ) {}

    async register(
        req: IUserRegisterRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            validateRequest(req, res, next);

            const { name, email, password, cpassword } = req.body;
            this.logger.info("New request to register a user", {
                name,
                email,
                password: "****",
            });

            if (cpassword !== password) {
                const error = createHttpError(
                    400,
                    "Confirm password should match with Password",
                );
                return next(error);
            }

            const newUser = await this.UserService.create({
                name,
                email,
                password,
            });

            const newOtp = await this.otpService.create(newUser);

            await addJobToQueue({
                email: newUser.email,
                otp: newOtp.otp,
                name: newUser.name,
            });

            this.logger.info(
                `User has been registered and Otp is send to mail id: ${newUser.email}`,
                { id: newUser.id },
            );

            res.status(201).json({
                message: "Otp is sended to your mail id",
                id: newUser.id,
            });
        } catch (error) {
            return next(error);
        }
    }

    async login(req: IUserLoginRequest, res: Response, next: NextFunction) {
        try {
            validateRequest(req, res, next);

            const { email, password } = req.body;
            this.logger.info("New request to Login a user", {
                email,
                password: "****",
            });

            // check is email is registered or not
            const user = await this.UserService.findByEmailWithPassword(email);
            if (!user) {
                const error = createHttpError(400, "Invalid credentials");
                return next(error);
            }

            if (user.googleId || !user.password) {
                const error = createHttpError(
                    400,
                    "Create new password because You register with Google",
                );
                return next(error);
            }

            const isCorrectPassword = await comparePassword(
                password,
                user.password,
            );

            if (!isCorrectPassword) {
                const error = createHttpError(400, "Invalid credentials");
                return next(error);
            }

            if (!user.verify) {
                const error = createHttpError(400, "Account is not verified");
                return next(error);
            }

            this.logger.info("User logged in", { id: user.id });

            setCookie(res, user.id);
            res.status(200).json({ user });
        } catch (error) {
            return next(error);
        }
    }

    async newPassword(
        req: INewPasswordRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            validateRequest(req, res, next);

            const { oldPassword, newPassword, cpassword } = req.body;
            const userId = req.userId;

            if (!userId) {
                const error = createHttpError(401, "User not authenticated");
                return next(error);
            }

            this.logger.info("Change password request", {
                userId,
            });

            if (cpassword !== newPassword) {
                const error = createHttpError(
                    400,
                    "Confirm password should match with new Password",
                );
                throw error;
            }

            const user = await this.UserService.findByIdWithPassword(userId);
            if (!user) {
                const error = createHttpError(400, "Invalid user id");
                return next(error);
            }

            const isCorrectPassword = await comparePassword(
                oldPassword,
                user.password,
            );

            if (!isCorrectPassword) {
                const error = createHttpError(400, "Invalid credentials");
                return next(error);
            }

            await this.UserService.updatePassword({ newPassword, id: userId });

            this.logger.info("Password updated", { id: userId });
            res.status(201).json({ id: userId });
        } catch (error) {
            return next(error);
        }
    }

    async forgotPassword(
        req: IForgotPasswordRequest,
        res: Response,
        next: NextFunction,
    ) {
        validateRequest(req, res, next);

        const { email, newPassword, cpassword } = req.body;

        this.logger.info("New request to forgot password", {
            email,
        });

        if (cpassword !== newPassword) {
            const error = createHttpError(
                400,
                "Confirm password should match with Password",
            );
            return next(error);
        }

        const user = await this.UserService.findByEmail(email);

        if (!user) {
            const error = createHttpError(400, "Account not found");
            return next(error);
        }

        await this.UserService.updatePassword({ email, newPassword });

        this.logger.info("New password created", {
            email,
            id: user.id,
        });

        res.status(200).json({ user });
    }

    async updateProfile(
        req: IUpdateInfoRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            validateRequest(req, res, next);

            const { name, email, password } = req.body;

            if (!req.user?.googleId || !req.user?.password) {
                const error = createHttpError(
                    400,
                    "Create new password because You register with Google",
                );
                return next(error);
            }

            const userId = req.userId || req.params.id;

            if (!userId) {
                const error = createHttpError(
                    400,
                    "User data not found or Invalid authentication",
                );
                return next(error);
            }

            this.logger.info("New request to change the user Profile data", {
                userId,
            });

            await this.UserService.updateInfo({
                name,
                password,
                email,
                id: userId,
            });

            this.logger.info("Password has been Updated", { id: userId });
            res.status(200).json({ id: userId });
        } catch (error) {
            return next(error);
        }
    }

    async verifiyAccount(
        req: IVerifyAccountRequest,
        res: Response,
        next: NextFunction,
    ) {
        validateRequest(req, res, next);

        const { email, otp } = req.body;

        this.logger.info("New request to verify account", {
            email,
        });

        const user = await this.UserService.findByEmail(email);

        if (!user) {
            const error = createHttpError(400, "Account not found");
            return next(error);
        }

        if (!user.verify) {
            const error = createHttpError(400, "Account is already verified");
            return next(error);
        }

        await this.otpService.check(email, otp);
        await this.UserService.updateVerify(email);

        this.logger.info("Account verified", {
            email,
            id: user.id,
        });

        setCookie(res, user.id);

        res.status(200).json({ user });
    }

    async verifiyOtp(
        req: IVerifyOtpRequest,
        res: Response,
        next: NextFunction,
    ) {
        validateRequest(req, res, next);

        const { email, otp } = req.body;

        this.logger.info("New request to verify Otp", {
            email,
        });

        const user = await this.UserService.findByEmail(email);

        if (!user) {
            const error = createHttpError(400, "Account not found");
            return next(error);
        }

        await this.otpService.check(email, otp);

        this.logger.info("Otp verified", {
            email,
            id: user.id,
        });

        res.status(200).json({ user });
    }

    async sendOtp(req: IResendOtpRequest, res: Response, next: NextFunction) {
        validateRequest(req, res, next);

        const { email } = req.body;
        this.logger.info(`new request to send otp`, { email });

        const user = await this.UserService.findByEmail(email);

        if (!user) {
            const error = createHttpError(400, "Account not found");
            return next(error);
        }

        const newOtp = await this.otpService.create(user);

        await addJobToQueue({
            email: user.email,
            otp: newOtp.otp,
            name: user.name,
        });

        this.logger.info(`Otp is send to mail id: ${user.email}`, {
            id: user.id,
        });

        res.status(200).json({ message: "OTP is sended to your mail id" });
    }
}
