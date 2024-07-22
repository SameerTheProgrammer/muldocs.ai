import { Repository } from "typeorm";
import { User } from "../entity/User";
import { IUserData } from "../types/auth.types";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

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

        // check is email is already registered or not
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            const error = createHttpError(
                400,
                "Email is already exists. Try with different email",
            );
            throw error;
        }

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        try {
            const data = this.userRepository.create({
                name,
                email,
                password: hashedPassword,
            });
            return await this.userRepository.save(data);
        } catch (error) {
            const err = createHttpError(
                500,
                "Failed to store the data in the database",
            );
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
}
