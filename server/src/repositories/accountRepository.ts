import { Op } from "sequelize";
import { Account, Organization, Role } from "../models";

// types and interfaces
import { Transaction } from "sequelize"
export interface IAccountRepository {
    findAccountById(id : string) : Promise<Account | null>
    findAccountByIdAndOrganization(id : string, organizationId : string) : Promise<Account | null>
    findAllAccountByOrganization(organizationId : string) : Promise<Account[]>
    findAccountByUsername(username : string) : Promise<Account | null>
    findAccountByEmail(email : string) : Promise<Account | null>
    findAccountByEmailOrUsername(identifier: string) : Promise<Account | null>
    createAccount(data : Partial<Account>, transaction? : Transaction) : Promise<Account>
}



export class AccountRepository implements IAccountRepository {
    findAccountById(id: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                account_id : id,
                archived : false
            },
            include: [
                {
                    model: Role,
                    as: 'role'
                },
                {
                    model: Organization,
                    as: 'organization'
                }
            ]
        });
    }

    findAccountByIdAndOrganization(id: string, organizationId: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                account_id : id,
                organization_id : organizationId,
                archived : false
            },
            include: [
                {
                    model: Role,
                    as: 'role'
                },
                {
                    model: Organization,
                    as: 'organization'
                }
            ]
        });
    }

    findAllAccountByOrganization(organizationId: string): Promise<Account[]> {
        return Account.findAll({
            where: {
                organization_id : organizationId,
                archived : false
            },
            include: [
                {
                    model: Role,
                    as: 'role'
                },
            ]
        });
    }

    findAccountByUsername(username: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                username : username,
                // archived : false
            }
        });
    }

    findAccountByEmail(email: string): Promise<Account | null> {
        return Account.findOne({
            where: {
                email : {
                    [Op.iLike] : email
                },
                archived : false
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
                ],
                archived : false
            },
            include: [
                {
                    model: Organization,
                    as: 'organization'
                }
            ]
        });
    }

    createAccount(data: Partial<Account>, transaction?: Transaction): Promise<Account> {
        return Account.create(data, { transaction });
    }
}