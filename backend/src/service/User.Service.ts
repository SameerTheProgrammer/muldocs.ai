import { Repository } from "typeorm";
import { User } from "../entity/User";
import { IUserData } from "../types/auth.types";
import createHttpError from "http-errors";

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ name, email, password }: IUserData) {
        // check is email is already registered or not
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            const error = createHttpError(
                400,
                "Email is already exists. Try with different email",
            );
            console.log(user);
            throw error;
        }

        try {
            const data = this.userRepository.create({
                name,
                email,
                password,
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
}
