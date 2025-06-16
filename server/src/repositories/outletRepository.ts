import { Op, Transaction } from "sequelize";
import { Account, Outlet } from "../models";

// models
import { AccountOutlets } from "../models";


// types and interfaces
export interface IOutletRepository {
    findOutletById(outletId : string) : Promise<Outlet | null>;
    findOutletByIds(outletIds : string[]) : Promise<Outlet[]>;
    findOutletByOrganization(organizationId : string) : Promise<Outlet[]>;
    findOutletByNameAndOrganization(outletName : string, organizationId : string) : Promise<Outlet | null>;
    findOutletByAccountId(accountId: string, organizationId: string): Promise<Outlet[]>
    createOutlet(data : Partial<Outlet>, transaction? : Transaction) : Promise<Outlet>;
}


export class OutletRepository implements IOutletRepository {
    async findOutletById(outletId: string): Promise<Outlet | null> {
        return Outlet.findOne({
            where: {
                outlet_id : outletId,
                archived : false,
            }
        });
    }

    async findOutletByIds(outletIds: string[]): Promise<Outlet[]> {
        return Outlet.findAll({
            where: {
                outlet_id : outletIds,
                archived : false,
            }
        });
    }

    async findOutletByOrganization(organizationId: string): Promise<Outlet[]> {
        return Outlet.findAll({
            where: {
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    async findOutletByNameAndOrganization(outletName: string, organizationId : string): Promise<Outlet | null> {
        return Outlet.findOne({
            where: {
                organization_id : organizationId,
                outlet_name : {
                    [Op.iLike] : outletName,
                },
                archived : false,
            }
        });
    }

    async findOutletByAccountId(accountId: string, organizationId: string): Promise<Outlet[]> {
        return Outlet.findAll({
            where: {
                organization_id: organizationId,
                archived: false,
            },
            include: [
                {
                    model: Account,
                    as: "accounts",
                    attributes: [],
                    where: {
                        account_id: accountId,
                        archived : false
                    },
                    required: true,
                }
            ],
        });
    }

    async createOutlet(data: Partial<Outlet>, transaction? : Transaction): Promise<Outlet> {
        return Outlet.create(data, { transaction });
    }
}