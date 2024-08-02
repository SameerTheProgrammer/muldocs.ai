import { Repository } from "typeorm";
import { Otp } from "../entity/Otp";
import { User } from "./../entity/User";
import env from "../config/dotenv";
import createHttpError from "http-errors";

export class OtpService {
    constructor(private optRepository: Repository<Otp>) {}

    private generateOtp() {
        const otp = (Math.random() * 100000).toString().slice(0, 6);
        return otp;
    }

    async create(user: User) {
        try {
            const otp = this.generateOtp();
            const MINUTE_IN_MS = env.OTP_EXPIRY_IN_MINUTE * 60 * 1000;
            const newOtp = this.optRepository.create({
                otp,
                user,
                expire: new Date(Date.now() + MINUTE_IN_MS),
            });
            return await this.optRepository.save(newOtp);
        } catch (err) {
            const error = createHttpError(400, "Error while creating OTP");
            throw error;
        }
    }

    async check(userId: string, otp: string): Promise<boolean> {
        try {
            const userOtps = await this.optRepository.findOne({
                where: { user: { id: userId }, otp },
            });
            if (!userOtps) {
                const error = createHttpError(400, "Wrong OTP");
                throw error;
            }
            return userOtps.expire > new Date(Date.now());
        } catch (err) {
            const error = createHttpError(400, "Error while validating OTP");
            throw error;
        }
    }
}
