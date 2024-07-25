import { Request } from "express";

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

export interface INewPasswordRequest extends Request {
    body: { oldPassword: string; newPassword: string; cpassword: string };
    params: {
        id: string;
    };
}
