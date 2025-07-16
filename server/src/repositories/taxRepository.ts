import { Op, Transaction } from "sequelize";
import { Outlet, Tax } from "../models";



export interface ITaxRepository {
    findTaxById(taxId : number) : Promise<Tax | null>
    findTaxByOrganization(organizationId : string, includeChild? : boolean) : Promise<Tax[]>
    findTaxByOrganizationAndName(organizationId : string, name : string) : Promise<Tax | null>
    createTax(data : Partial<Tax>, transaction? : Transaction) : Promise<Tax>
}

export class TaxRepository implements ITaxRepository {
    findTaxById(taxId: number): Promise<Tax | null> {
        return Tax.findOne({
            where: {
                tax_id : taxId,
                archived : false,
            }
        });
    }

    findTaxByOrganization(organizationId: string, includeChild? : boolean): Promise<Tax[]> {
        if (!includeChild) {
            return Tax.findAll({
                where: {
                    organization_id : organizationId,
                    archived : false,
                }
            });
        }

        return Tax.findAll({
            where: {
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
            ]
        });
    }

    findTaxByOrganizationAndName(organizationId: string, name: string): Promise<Tax | null> {
        return Tax.findOne({
            where: {
                name : {
                    [Op.iLike] : name,
                },
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    createTax(data: Partial<Tax>, transaction?: Transaction): Promise<Tax> {
        return Tax.create(data, { transaction });
    }
}