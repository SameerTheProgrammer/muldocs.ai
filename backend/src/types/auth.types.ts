import { Request } from "express";

export interface IUserData {
    name: string;
    email: string;
    password: string;
}

export interface IUserRegisterRequest extends Request {
    body: IUserData;
}
