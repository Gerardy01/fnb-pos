import { Transaction } from "sequelize";
import { Gratuity, Outlet, SalesTypeGratuity } from "../models";


export interface ISalesTypeGratuityRepository {
    findSalesTypeGratuityBySalesType(salesTypeId : number) : Promise<SalesTypeGratuity[]>
    bulkCreateSalesTypeGratuity(data : Partial<SalesTypeGratuity>[], transaction? : Transaction) : Promise<SalesTypeGratuity[]>
    destroySalesTypeGratuity(salesTypeId : number, transaction? : Transaction) : Promise<void>
}


export class SalesTypeGratuityRepository implements ISalesTypeGratuityRepository {
    findSalesTypeGratuityBySalesType(salesTypeId: number): Promise<SalesTypeGratuity[]> {
        return SalesTypeGratuity.findAll({
            where: {
                sales_type_id : salesTypeId,
            },
            include: [
                {
                    model: Gratuity,
                    as: 'gratuity',
                    where: {
                        archived: false
                    },
                    required: true
                },
                {
                    model: Outlet,
                    as: 'outlet',
                    required: false
                }
            ], 
        });
    }

    bulkCreateSalesTypeGratuity(data: Partial<SalesTypeGratuity>[], transaction?: Transaction): Promise<SalesTypeGratuity[]> {
        return SalesTypeGratuity.bulkCreate(data, { transaction });
    }

    async destroySalesTypeGratuity(salesTypeId: number, transaction?: Transaction): Promise<void> {
        SalesTypeGratuity.destroy({
            where: {
                sales_type_id : salesTypeId,
            },
            transaction
        })
    }
}