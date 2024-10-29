import { Op } from "sequelize";
import { RefreshToken } from "../models";

// types and interfaces
import { Transaction } from "sequelize"
export interface IRefreshTokenRepository {
    findByIdentifier(identifier : string) : Promise<RefreshToken | null>
    findByAccount(accountId : string) : Promise<RefreshToken[]>
    recordRefreshToken(data : Partial<RefreshToken>, transaction? : Transaction) : Promise<RefreshToken>
    revokeAllByAccount(accountId: string, transaction?: Transaction): Promise<[number]>;
}



export class RefreshTokenRepository implements IRefreshTokenRepository {
    findByIdentifier(identifier: string): Promise<RefreshToken | null> {
        return RefreshToken.findOne({
            where: {
                identifier : identifier
            },
        });
    }

    findByAccount(accountId: string): Promise<RefreshToken[]> {
        return RefreshToken.findAll({
            where: {
                account_id : accountId
            },
            order: [['created_at', 'ASC']]
        });
    }

    recordRefreshToken(data: Partial<RefreshToken>, transaction? : Transaction): Promise<RefreshToken> {
        return RefreshToken.create(data, { transaction })
    }

    revokeAllByAccount(accountId: string, transaction?: Transaction): Promise<[number]> {
        return RefreshToken.update(
            { is_revoked: true },
            {
                where: { account_id: accountId },
                transaction
            }
        );
    }
}