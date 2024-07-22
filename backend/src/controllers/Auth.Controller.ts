import { NextFunction, Response } from "express";
import { IUserLoginRequest, IUserRegisterRequest } from "../types/auth.types";
import { Logger } from "winston";
import { UserService } from "../service/User.Service";
import { setCookie } from "../utils/cookie";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

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
}
