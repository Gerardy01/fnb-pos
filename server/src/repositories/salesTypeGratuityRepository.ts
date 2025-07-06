import { Transaction } from "sequelize";
import { SalesTypeGratuity } from "../models";


export interface ISalesTypeGratuityRepository {
    bulkCreateSalesTypeGratuity(data : Partial<SalesTypeGratuity>[], transaction? : Transaction) : Promise<SalesTypeGratuity[]>
}


export class SalesTypeGratuityRepository implements ISalesTypeGratuityRepository {
    bulkCreateSalesTypeGratuity(data: Partial<SalesTypeGratuity>[], transaction?: Transaction): Promise<SalesTypeGratuity[]> {
        return SalesTypeGratuity.bulkCreate(data, { transaction });
    }
}