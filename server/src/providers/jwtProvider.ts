import jwt from "jsonwebtoken";

// types and interfaces
import { IAccessTokenBody, IRefreshTokenBody } from "../interfaces/IAuth";
export interface IJwtProvider {
    generateAccessToken(data : IAccessTokenBody, tokenSecret: string, expiresIn : string) : Promise<string>;
    generateRefreshToken(data : IRefreshTokenBody, tokenSecret: string, expiresIn : string) : Promise<string>;
}

export class JsonWebTokenJwtProvider implements IJwtProvider {
    async generateAccessToken(data: IAccessTokenBody, tokenSecret: string, expiresIn: string): Promise<string> {
        return jwt.sign(data, tokenSecret, { expiresIn: expiresIn })
    }

    async generateRefreshToken(data: IRefreshTokenBody, tokenSecret: string, expiresIn: string): Promise<string> {
        return jwt.sign(data, tokenSecret, { expiresIn: expiresIn })
    }
}