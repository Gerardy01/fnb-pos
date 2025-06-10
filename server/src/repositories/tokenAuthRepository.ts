import { Transaction } from "sequelize";
import { TokenAuth } from "../models";



export interface ITokenAuthRepository {
    createTokenAuth(data: Partial<TokenAuth>, transaction? : Transaction): Promise<TokenAuth>;
    revokeActiveTokenByAccount(accountId : string, transaction? : Transaction): Promise<void>;
}

export class TokenAuthRepository implements ITokenAuthRepository {
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