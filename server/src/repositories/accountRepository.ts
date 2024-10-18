import { Op } from "sequelize";
import { Account, Role } from "../models";

// types and interfaces
import { Transaction } from "sequelize"
export interface IAccountRepository {
    findAccountById(id : string) : Promise<Account | null>
    findAccountWithRole(id : string) : Promise<Account | null>
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

    findAccountWithRole(id: string): Promise<Account | null> {
        return Account.findOne({
            where: {account_id : id},
            include: [{
                model: Role,
                as: 'role'
            }]
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
                    { email: {
                        [Op.iLike] : identifier
                    }}
                ]
            }
        });
    }

    createAccount(data: Partial<Account>, transaction?: Transaction): Promise<Account> {
        return Account.create(data, { transaction });
    }
}