"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("./config/dotenv");
const googleapis_1 = require("googleapis");
const { OAuth2 } = googleapis_1.google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = dotenv_1.env;
const auth = new OAuth2(MAILING_ID, MAILING_SECRET, oauth_link);
const sendVerificationEmail = (email, otp, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        auth.setCredentials({
            refresh_token: MAILING_REFRESH,
        });
        const accessToken = yield auth.getAccessToken();
        const stmp = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL,
                clientId: MAILING_ID,
                clientSecret: MAILING_SECRET,
                refreshToken: MAILING_REFRESH,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: "Muldocs.ai email verification",
            html: `
            <div style="max-width: 700px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e5e5e5; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; align-items: center; gap: 10px; font-weight: 600; color: #3b5998; margin-bottom: 1rem;">
                    <img src="https://muldoc.ai/logo.png" alt="Muldoc.ai" style="width: 30px;">
                    <span>Action Required: Verify Your Account on Muldoc.ai</span>
                </div>
                <div style="font-size: 17px; color: #141823; padding: 1rem 0;">
                    <span>Hello ${name},</span>
                    <div style="padding: 20px 0;">
                        <span>
                            You recently created an account on Muldoc.ai. To complete your registration, please use the following One-Time Password (OTP) to verify your account:
                        </span>
                        <div style="font-size: 24px; font-weight: bold; color: #4c649b; margin: 20px 0;">
                            ${otp}
                        </div>
                        <span>
                            Please enter this OTP on the verification page within the next 10 minutes to confirm your account. If you did not request this verification, please ignore this email.
                        </span>
                    </div>
                </div>
                <div style="color: #898f9c; padding-top: 20px;">
                    <span>
                        Thank you for choosing Muldoc.ai. We look forward to helping you chat with any document and get your questions answered effortlessly.
                    </span>
                </div>
            </div>`,
        };
        const result = yield stmp.sendMail(mailOptions);
        return result;
    }
    catch (error) {
        return error;
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendResetCode = (email, name, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        auth.setCredentials({
            refresh_token: MAILING_REFRESH,
        });
        const accessToken = yield auth.getAccessToken();
        const stmp = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL,
                clientId: MAILING_ID,
                clientSecret: MAILING_SECRET,
                refreshToken: MAILING_REFRESH,
                accessToken,
            },
        });
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: "Reset Muldocs.ai password",
            html: `
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e5e5e5; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; align-items: center; gap: 10px; font-weight: 600; color: #3b5998; margin-bottom: 1rem;">
                        <img src="https://muldoc.ai/logo.png" alt="Muldoc.ai" style="width: 30px;">
                        <span>Reset Your Password on Muldoc.ai</span>
                    </div>
                    <div style="font-size: 17px; color: #141823; padding: 1rem 0;">
                        <span>Hello ${name},</span>
                        <div style="padding: 20px 0;">
                            <span>
                                We received a request to reset your password for your Muldoc.ai account. Please use the following One-Time Password (OTP) to reset your password:
                            </span>
                            <div style="font-size: 24px; font-weight: bold; color: #4c649b; margin: 20px 0;">
                                ${otp}
                            </div>
                            <span>
                                Please enter this OTP on the password reset page within the next 10 minutes to reset your password. If you did not request a password reset, please ignore this email.
                            </span>
                        </div>
                    </div>
                    <div style="color: #898f9c; padding-top: 20px;">
                        <span>
                            Thank you for using Muldoc.ai. If you have any questions or need assistance, please contact our support team.
                        </span>
                    </div>
                </div>
    
    `,
        };
        const result = yield stmp.sendMail(mailOptions);
        return result;
    }
    catch (error) {
        return error;
    }
});
