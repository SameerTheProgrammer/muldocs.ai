import { RequestHandler, Router } from "express";
import passport from "../config/passport-config";
import env from "../config/dotenv";

const router = Router();

router.get(
    "/",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }) as RequestHandler,
);

router.get(
    "/callback",
    passport.authenticate("google", {
        successRedirect: `${env.FRONTEND_URL}`,
        failureRedirect: `${env.FRONTEND_URL}/login`,
    }) as RequestHandler,
);

export default router;
