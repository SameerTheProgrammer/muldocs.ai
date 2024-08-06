import { Repository } from "typeorm";
import { Otp } from "../entity/Otp";
import { User } from "../entity/User";
import env from "../config/dotenv";
import createHttpError from "http-errors";

export class OtpService {
    constructor(private optRepository: Repository<Otp>) {}

    private generateOtp(): string {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
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

    async check(email: string, otp: string) {
        const userOtp = await this.optRepository.findOne({
            where: { user: { email: email }, otp },
        });

        if (!userOtp) {
            const error = createHttpError(400, "Wrong OTP");
            throw error;
        }

        if (userOtp.isUsed) {
            const error = createHttpError(400, "OTP is already used");
            throw error;
        }

        const isExpired = userOtp.expire > new Date(Date.now());

        if (!isExpired) {
            const error = createHttpError(400, "Otp is expired");
            throw error;
        }
        return;
    }
}
