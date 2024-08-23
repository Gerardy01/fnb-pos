import { Op } from "sequelize"
import RefreshToken from "../models/refreshToken.model"

// types and interfaces
import { Transaction } from "sequelize"
export interface IRefreshTokenRepository {
    findByIdentifier(identifier : string) : Promise<RefreshToken | null>
    findByAccount(accountId : string) : Promise<RefreshToken[]>
    recordRefreshToken(data : Partial<RefreshToken>, transaction? : Transaction) : Promise<RefreshToken>
    
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
}