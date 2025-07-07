import { Op, Transaction } from "sequelize";
import { Gratuity, Outlet, SalesType, SalesTypeGratuity } from "../models";


export interface ISalesTypeRepository {
    findSalesTypeByOrganization(organizationId : string, includeChild? : boolean) : Promise<SalesType[]>
    findSalesTypeById(salesTypeId : number) : Promise<SalesType | null>
    findSalesTypeByName(name : string, organizationId : string) : Promise<SalesType | null>
    createSalesType(data : Partial<SalesType>, transaction? : Transaction) : Promise<SalesType>
}

export class SalesTypeRepository implements ISalesTypeRepository {
    findSalesTypeByOrganization(organizationId: string, includeChild? : boolean): Promise<SalesType[]> {
        if (!includeChild) {
            return SalesType.findAll({
                where : {
                    organization_id : organizationId,
                    archived : false,
                }
            });
        }

        return SalesType.findAll({
            where : {
                organization_id : organizationId,
                archived : false,
            },
            include: [
                {
                    model: Outlet,
                    as: 'outlets',
                    through: { attributes: [] },
                    where : {
                        archived : false,
                    },
                    required : false,
                },
                {
                    model: SalesTypeGratuity,
                    as: 'sales_type_gratuity',
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
                    required: false,
                }
            ]
        });
    }

    findSalesTypeById(salesTypeId: number): Promise<SalesType | null> {
        return SalesType.findOne({
            where: {
                sales_type_id : salesTypeId,
                archived : false,
            }
        });
    }

    findSalesTypeByName(name: string, organizationId: string): Promise<SalesType | null> {
        return SalesType.findOne({
            where: {
                name : {
                    [Op.iLike] : name,
                },
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    createSalesType(data: Partial<SalesType>, transaction?: Transaction): Promise<SalesType> {
        return SalesType.create(data, { transaction });
    }
}