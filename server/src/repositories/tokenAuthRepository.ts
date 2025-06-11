import { Transaction } from "sequelize";
import { Account, TokenAuth } from "../models";



export interface ITokenAuthRepository {
    findByToken(token : string) : Promise<TokenAuth | null>;
    createTokenAuth(data: Partial<TokenAuth>, transaction? : Transaction): Promise<TokenAuth>;
    revokeActiveTokenByAccount(accountId : string, transaction? : Transaction): Promise<void>;
}

export class TokenAuthRepository implements ITokenAuthRepository {
    findByToken(token: string): Promise<TokenAuth | null> {
        return TokenAuth.findOne({
            where: {
                token : token,
                used : false
            },
            include: [
                {
                    model: Account,
                    as: 'account'
                }
            ]
        })
    }
    async createTokenAuth(data: Partial<TokenAuth>, transaction? : Transaction): Promise<TokenAuth> {
        return TokenAuth.create(data, { transaction });
    }

    async revokeActiveTokenByAccount(accountId: string, transaction? : Transaction): Promise<void> {
        TokenAuth.update(
            { used : true },
            {
                where : {
                    account_id : accountId,
                    used : false
                },
                transaction
            }
        )
    }
}