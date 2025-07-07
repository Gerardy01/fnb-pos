import { Transaction } from "sequelize";
import { SalesTypeOutlets } from "../models";


export interface ISalesTypeOutletRepository {
    bulkCreateSalesTypeOutlet(data : Partial<SalesTypeOutlets>[], transaction? : Transaction) : Promise<SalesTypeOutlets[]>
    destroySalesTypeOutlet(salesTypeId : number, transaction? : Transaction) : Promise<void>
}

export class SalesTypeOutletRepository implements ISalesTypeOutletRepository {
    bulkCreateSalesTypeOutlet(data: Partial<SalesTypeOutlets>[], transaction?: Transaction): Promise<SalesTypeOutlets[]> {
        return SalesTypeOutlets.bulkCreate(data, { transaction });
    }

    async destroySalesTypeOutlet(salesTypeId: number, transaction?: Transaction): Promise<void> {
        SalesTypeOutlets.destroy({
            where: {
                sales_type_id : salesTypeId,
            },
            transaction
        });
    }
}