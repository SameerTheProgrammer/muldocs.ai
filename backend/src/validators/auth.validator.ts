import { checkSchema } from "express-validator";
import { INewPasswordRequest, IUserRegisterRequest } from "../types/auth.types";

export const registerValidation = checkSchema({
    name: {
        exists: {
            errorMessage: "Name is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Name cannot be empty",
            bail: true,
        },
        isLength: {
            options: { min: 2, max: 30 },
            errorMessage: "Name should be between 2 and 30 characters",
        },
    },
    email: {
        exists: {
            errorMessage: "Email is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Email cannot be empty",
            bail: true,
        },
        isEmail: {
            errorMessage: "Invalid Email",
        },
    },
    password: {
        exists: {
            errorMessage: "Password is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Password cannot be empty",
            bail: true,
        },
        isLength: {
            options: { min: 10 },
            errorMessage: "Password should be at least 10 characters long",
            bail: true,
        },
        isStrongPassword: {
            options: {
                minUppercase: 1,
                minLowercase: 1,
                minSymbols: 1,
                minNumbers: 1,
            },
            errorMessage:
                "Password should contain at least one symbol, number, uppercase, and lowercase letter",
        },
    },
    cpassword: {
        exists: {
            errorMessage: "Confirm password is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Confirm password cannot be empty",
            bail: true,
        },
        custom: {
            options: (value, { req }) =>
                value === (req as IUserRegisterRequest).body.password,
            errorMessage: "Passwords do not match",
        },
    },
});

export const loginValidation = checkSchema({
    email: {
        exists: {
            errorMessage: "Email is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Email cannot be empty",
            bail: true,
        },
        isEmail: {
            errorMessage: "Invalid Email",
        },
    },
    password: {
        exists: {
            errorMessage: "Password is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Password cannot be empty",
        },
    },
});

export const newPasswordValidation = checkSchema({
    oldPassword: {
        exists: {
            errorMessage: "Old password is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Old password cannot be empty",
            bail: true,
        },
    },
    newPassword: {
        exists: {
            errorMessage: "Password is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Password cannot be empty",
            bail: true,
        },
        isLength: {
            options: { min: 10 },
            errorMessage: "Password should be at least 10 characters long",
            bail: true,
        },
        isStrongPassword: {
            options: {
                minUppercase: 1,
                minLowercase: 1,
                minSymbols: 1,
                minNumbers: 1,
            },
            errorMessage:
                "Password should contain at least one symbol, number, uppercase, and lowercase letter",
        },
    },
    cpassword: {
        exists: {
            errorMessage: "Confirm Password is required",
            bail: true,
        },
        trim: true,
        notEmpty: {
            errorMessage: "Confirm Password cannot be empty",
        },
        custom: {
            options: (value, { req }) =>
                value === (req as INewPasswordRequest).body.newPassword,
            errorMessage: "Passwords do not match",
        },
    },
});
