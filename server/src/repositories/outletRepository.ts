import { Op } from "sequelize";
import { Outlet } from "../models";


// types and interfaces
export interface IOutletRepository {
    findOutletByOrganization(organizationId : string) : Promise<Outlet[]>;
    findOutletByNameAndOrganization(outletName : string, organizationId : string) : Promise<Outlet | null>;
    createOutlet(data : Partial<Outlet>) : Promise<Outlet>;
}


export class OutletRepository implements IOutletRepository {
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
                outlet_name : outletName,
                archived : false,
            }
        });
    }

    async createOutlet(data: Partial<Outlet>): Promise<Outlet> {
        return Outlet.create(data);
    }
}