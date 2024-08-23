import { Op } from "sequelize"
import Account from "../models/account.model"

// types and interfaces
import { Transaction } from "sequelize"
export interface IAccountRepository {
    findAccountById(id : string) : Promise<Account | null>
    findAccountByUsername(username : string) : Promise<Account | null>
    findAccountByEmail(email : string) : Promise<Account | null>
    findAccountByEmailOrUsername(identifier: string) : Promise<Account | null>
    createAccount(data : Partial<Account>, transaction? : Transaction) : Promise<Account>
}



export class AccountRepository implements IAccountRepository {
    findAccountById(id: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                account_id : id
            }
        });
    }

    findAccountByUsername(username: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                username : username
            }
        });
    }

    findAccountByEmail(email: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                email : email
            }
        });
    }

    findAccountByEmailOrUsername(identifier: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                [Op.or]: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        });
    }

    createAccount(data: Partial<Account>, transaction?: Transaction): Promise<Account> {
        return Account.create(data, { transaction });
    }
}