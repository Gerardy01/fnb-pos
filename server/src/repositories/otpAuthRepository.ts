import { Op } from "sequelize";
import { OtpAuth } from "../models";

// types and interfaces
export interface IOtpAuthRepository {
    findActiveOtpsByCode(code : number): Promise<OtpAuth | null>;
    revokeActiveOtpByAddress(address : string) : Promise<number[]>;
    createOtpAuth(data: Partial<OtpAuth>) : Promise<OtpAuth>;
}

export class OtpAuthRepository implements IOtpAuthRepository {
    findActiveOtpsByCode(code: number): Promise<OtpAuth | null> {
        return OtpAuth.findOne({
            where: {
                code : code,
                revoked : false
            }
        });
    }
    revokeActiveOtpByAddress(address: string): Promise<number[]> {
        return OtpAuth.update(
            { revoked: true },
            {
                where: {
                    send_to : address,
                    revoked : false
                }
            }
        )
    }
    createOtpAuth(data: Partial<OtpAuth>): Promise<OtpAuth> {
        return OtpAuth.create(data);
    }
}