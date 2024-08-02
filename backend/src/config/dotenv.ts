import { config } from "dotenv";
import { cleanEnv, num, port, str } from "envalid";
import path from "path";

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

export const env = cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str({ default: "dev", choices: ["prod", "dev"] }),
    DB_HOST: str(),
    DB_PORT: port(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    JWT_SECRET: str(),
    JWT_TOKEN_EXPIRY_DAYS: str(),
    COOKIE_MAXAGE_DAYS: num(),
    COOKIE_DOMAIN: str(),
    OTP_EXPIRY_IN_MINUTE: num(),
    REDIS_HOST: str(),
    REDIS_PORT: port(),
});

export default env;
