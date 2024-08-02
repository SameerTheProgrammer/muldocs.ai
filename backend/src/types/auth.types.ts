import { Request } from "express";
import { User } from "../entity/User";

export interface IUserData {
    name: string;
    email: string;
    password: string;
    cpassword: string;
}

export interface IUserRegisterRequest extends Request {
    body: IUserData;
}

export interface ILoginUserData {
    email: string;
    password: string;
}

export interface IUserLoginRequest extends Request {
    body: ILoginUserData;
}

export interface IUpdatePasswordData {
    newPassword: string;
    id?: string;
    email?: string;
}

export interface AuthMiddlewareProps extends Request {
    userId?: string;
    user?: User;
}

export interface AuthMiddlewareRequest extends AuthMiddlewareProps {
    cookies: {
        "muldocs.ai"?: string;
    };
    body: {
        token?: string;
    };
}

export interface INewPasswordRequest extends AuthMiddlewareProps {
    body: { oldPassword: string; newPassword: string; cpassword: string };
}

export interface IUpdateInfoData {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface IUpdateInfoRequest extends AuthMiddlewareProps {
    body: IUpdateInfoData;
}

export interface IVerifyOtpRequest extends Request {
    body: {
        email: string;
        otp: string;
    };
}

export interface IResendOtpRequest extends Request {
    body: {
        email: string;
    };
}
