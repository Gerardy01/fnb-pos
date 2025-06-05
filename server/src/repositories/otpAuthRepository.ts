import { Op, Transaction } from "sequelize";
import { OtpAuth } from "../models";

// types and interfaces
export interface IOtpAuthRepository {
    findActiveOtpsByCode(code : number, transaction? : Transaction): Promise<OtpAuth | null>;
    revokeActiveOtpByAddress(address : string) : Promise<number[]>;
    createOtpAuth(data: Partial<OtpAuth>) : Promise<OtpAuth>;
}

export class OtpAuthRepository implements IOtpAuthRepository {
    findActiveOtpsByCode(code: number, transaction? : Transaction): Promise<OtpAuth | null> {
        return OtpAuth.findOne({
            where: {
                code : code,
                revoked : false
            },
            transaction
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