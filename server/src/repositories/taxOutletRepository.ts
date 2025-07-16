import { Transaction } from "sequelize";
import { TaxOutlets } from "../models";


export interface ITaxOutletRepository {
    bulkCreateTaxOutlet(data : Partial<TaxOutlets>[], transaction? : Transaction) : Promise<TaxOutlets[]>
    destroyTaxOutlet(taxId : number, transaction? : Transaction) : Promise<void>
}

export class TaxOutletRepository implements ITaxOutletRepository {
    bulkCreateTaxOutlet(data: Partial<TaxOutlets>[], transaction?: Transaction): Promise<TaxOutlets[]> {
        return TaxOutlets.bulkCreate(data, { transaction });
    }

    async destroyTaxOutlet(taxId: number, transaction?: Transaction): Promise<void> {
        TaxOutlets.destroy({
            where: {
                tax_id : taxId,
            },
            transaction
        });
    }
}