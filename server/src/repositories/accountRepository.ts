import Account from "../models/account.model"

// types and interfaces
import { Transaction } from "sequelize"
export interface IAccountRepository {
    findAccountByUsername(username : string) : Promise<Account | null>
    findAccountByEmail(email : string) : Promise<Account | null>
    createAccount(data : Partial<Account>, transaction? : Transaction) : Promise<Account>
}



export class AccountRepository implements IAccountRepository {
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
    createAccount(data: Partial<Account>, transaction?: Transaction): Promise<Account> {
        return Account.create(data, { transaction });
    }
}