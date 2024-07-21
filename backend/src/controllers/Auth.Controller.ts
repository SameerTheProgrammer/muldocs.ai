import { NextFunction, Response } from "express";
import { IUserRegisterRequest } from "../types/auth.types";
import { Logger } from "winston";
import { UserService } from "../service/User.Service";
import { setCookie } from "../utils/cookie";

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
            const { name, email, password } = req.body;
            this.logger.info("New request to register a user", {
                name,
                email,
                password: "****",
            });

            const newUser = await this.UserService.create({
                name,
                email,
                password,
            });

            this.logger.info("User has been registered", { id: newUser.id });

            setCookie(res, newUser.id);
            res.status(201).json({ id: newUser.id });
        } catch (error) {
            return next(error);
        }
    }
}
