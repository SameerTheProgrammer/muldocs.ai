/* eslint-disable @typescript-eslint/no-unused-vars */
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
};
