import { NextFunction, Response } from "express";
import {
    INewPasswordRequest,
    IUpdateInfoRequest,
    IUserLoginRequest,
    IUserRegisterRequest,
} from "../types/auth.types";
import { Logger } from "winston";
import { UserService } from "../service/User.Service";
import { setCookie } from "../utils/cookie";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

export class AuthController {
    constructor(
        private UserService: UserService,
        private logger: Logger,
    ) {}

    async register(
        req: IUserRegisterRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    errors: result.array(),
                });
            }

            const { name, email, password, cpassword } = req.body;
            this.logger.info("New request to register a user", {
                name,
                email,
                password: "****",
            });

            const newUser = await this.UserService.create({
                name,
                email,
                password,
                cpassword,
            });

            this.logger.info("User has been registered", { id: newUser.id });

            setCookie(res, newUser.id);
            res.status(201).json({ id: newUser.id });
        } catch (error) {
            return next(error);
        }
    }

    async login(req: IUserLoginRequest, res: Response, next: NextFunction) {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    errors: result.array(),
                });
            }
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

            const isCorrectPassword = await bcrypt.compare(
                password,
                user.password,
            );

            if (!isCorrectPassword) {
                const error = createHttpError(400, "Invalid credentials");
                return next(error);
            }

            this.logger.info("User has been LoggedIn", { id: user.id });

            setCookie(res, user.id);
            res.status(200).json({ id: user.id });
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
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    errors: result.array(),
                });
            }

            const { oldPassword, newPassword, cpassword } = req.body;
            const userId = req.userId;

            if (!userId) {
                const error = createHttpError(401, "User not authenticated");
                return next(error);
            }

            this.logger.info("New request to change the password", {
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

            const isCorrectPassword = await bcrypt.compare(
                oldPassword,
                user.password,
            );

            if (!isCorrectPassword) {
                const error = createHttpError(400, "Invalid credentials");
                return next(error);
            }

            await this.UserService.updatePassword({ newPassword, id: userId });

            this.logger.info("Password has been Updated", { id: userId });
            res.status(201).json({ id: userId });
        } catch (error) {
            return next(error);
        }
    }

    async updateProfile(
        req: IUpdateInfoRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    errors: result.array(),
                });
            }

            const { name, email, password } = req.body;
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
            res.status(201).json({ id: userId });
        } catch (error) {
            return next(error);
        }
    }
}
