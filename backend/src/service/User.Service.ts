import { Repository } from "typeorm";
import { User } from "../entity/User";
import {
    IUpdateInfoData,
    IUpdatePasswordData,
    IUserData,
} from "../types/auth.types";
import createHttpError from "http-errors";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ name, email, password, cpassword }: IUserData) {
        if (cpassword !== password) {
            const error = createHttpError(
                400,
                "Confirm password should match with Password",
            );
            throw error;
        }

        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            const error = createHttpError(
                400,
                "Email is already registered. Try with different email",
            );
            throw error;
        }

        const hashedPassword = await hashPassword(password);

        try {
            const data = this.userRepository.create({
                name,
                email,
                password: hashedPassword,
            });
            return await this.userRepository.save(data);
        } catch (error) {
            // todo:- show class validator error properly
            if (typeof error == "object") {
                throw error;
            }
            const err = createHttpError(400, "Error saving new user");
            throw err;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email: email.toLowerCase(),
            },
        });
    }

    async findByEmailWithPassword(email: string) {
        return await this.userRepository.findOne({
            where: {
                email: email.toLowerCase(),
            },
            select: ["id", "name", "email", "password"],
        });
    }

    async findByIdWithPassword(id: string) {
        return await this.userRepository.findOne({
            where: { id },
            select: ["password"],
        });
    }

    async updatePassword({ newPassword, id, email }: IUpdatePasswordData) {
        const user = id
            ? await this.findByIdWithPassword(id)
            : await this.findByEmailWithPassword(email!);

        if (!user) {
            const error = createHttpError(400, "Invalid user id");
            throw error;
        }

        const hashedPassword = await hashPassword(newPassword);

        try {
            user.password = hashedPassword;
            return this.userRepository.save(user);
        } catch (error) {
            const err = createHttpError(400, "Error updating password");
            throw err;
        }
    }

    async updateVerify(email: string) {
        try {
            return this.userRepository.update(email, {
                verify: true,
            });
        } catch (error) {
            const err = createHttpError(
                400,
                "Error updating user verify field",
            );
            throw err;
        }
    }

    async updateInfo({ name, password, id, email }: IUpdateInfoData) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ["password"],
        });

        if (!user) {
            const error = createHttpError(400, "Invalid user id");
            throw error;
        }

        const isCorrectPassword = await comparePassword(
            password,
            user.password,
        );

        if (!isCorrectPassword) {
            const error = createHttpError(400, "Invalid credentials");
            throw error;
        }

        const isEmailUsed = await this.findByEmail(email);

        if (isEmailUsed) {
            const error = createHttpError(400, "Email is already registered");
            throw error;
        }

        try {
            user.name = name || user.name;
            user.email = email || user.email;
            return this.userRepository.save(user);
        } catch (error) {
            const err = createHttpError(400, "Error updating user info");
            throw err;
        }
    }
}
