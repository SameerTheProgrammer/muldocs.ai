/* eslint-disable @typescript-eslint/no-misused-promises */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { UserService } from "../service/User.Service";
import { User } from "../entity/User";
import { AppDataSource } from "./data-source";
import createHttpError from "http-errors";
import logger from "./logger";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "api/v1/auth/google/callback",
        },
        async (
            _accessToken: string,
            _refreshToken: string,
            profile: Profile,
            done: (err: Error | null, user?: User) => void,
        ) => {
            const userService = new UserService(
                AppDataSource.getRepository(User),
            );
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    const error = createHttpError(
                        400,
                        "No email found in profile",
                    );
                    done(error, undefined);
                    return;
                }
                const user = await userService.create({
                    name: profile.displayName ?? "Anonymous",
                    email,
                    password: "",
                    googleId: profile.id,
                });
                done(null, user);
            } catch (err) {
                if (err instanceof Error) {
                    logger.error(
                        `Error during Google authentication: ${err.message}`,
                    );
                    done(err);
                } else {
                    const unknownError = new Error(
                        "Unknown error occurred during Google authentication",
                    );
                    logger.error(unknownError.message);
                    done(unknownError);
                }
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, (user as { id: string }).id);
});

passport.deserializeUser(
    async (id: string, done: (err: Error | null, user?: User) => void) => {
        const userService = new UserService(AppDataSource.getRepository(User));
        try {
            const user = await userService.findById(id);
            if (!user) {
                const error = createHttpError(404, "User not found");
                logger.error(error.message);
                done(error, undefined);
            }
            done(null, user!);
        } catch (err) {
            if (err instanceof Error) {
                logger.error(
                    `Error during user deserialization: ${err.message}`,
                );
                done(err);
            } else {
                const unknownError = new Error(
                    "Unknown error occurred during user deserialization",
                );
                logger.error(unknownError.message);
                done(unknownError);
            }
        }
    },
);

export default passport;
