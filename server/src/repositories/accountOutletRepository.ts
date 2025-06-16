import { Transaction } from "sequelize";
import AccountOutlets from "../models/accountOutlet.model";



export interface IAccountOutletRepository {
    createAccountOutlet(data : Partial<AccountOutlets>, transaction? : Transaction) : Promise<AccountOutlets>
    bulkCreateAccountOutlet(data : Partial<AccountOutlets>[], transaction? : Transaction) : Promise<AccountOutlets[]>
    destroyAccountOutlet(accountId : string, transaction? : Transaction) : Promise<void>
}

export class AccountOutletRepository implements IAccountOutletRepository {
    createAccountOutlet(data: Partial<AccountOutlets>, transaction?: Transaction): Promise<AccountOutlets> {
        return AccountOutlets.create(data, { transaction });
    }

    bulkCreateAccountOutlet(data: Partial<AccountOutlets>[], transaction?: Transaction): Promise<AccountOutlets[]> {
        return AccountOutlets.bulkCreate(data, { transaction });
    }

    async destroyAccountOutlet(accountId: string, transaction?: Transaction): Promise<void> {
        AccountOutlets.destroy({
            where: {
                account_id : accountId
            },
            transaction
        });
    }
}
