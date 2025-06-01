import { Op } from "sequelize";
import { OtpAuth } from "../models";

// types and interfaces
export interface IOtpAuthRepository {
    createOtpAuth(data: Partial<OtpAuth>) : Promise<OtpAuth>;
}

export class OtpAuthRepository implements IOtpAuthRepository {
    createOtpAuth(data: Partial<OtpAuth>): Promise<OtpAuth> {
        return OtpAuth.create(data);
    }
}