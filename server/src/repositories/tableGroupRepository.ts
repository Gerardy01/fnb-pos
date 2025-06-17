import { Op, Transaction } from "sequelize";
import { TableGroup } from "../models";



export interface ITableGroupRepository {
    findTableGroupById(id : number) : Promise<TableGroup | null>
    findTableGroupByName(groupName : string, outletId : string) : Promise<TableGroup | null>
    findAllTableGroup(organizationId : string) : Promise<TableGroup[]>;
    findTableGroupByOutlet(outletId : string, organizationId : string) : Promise<TableGroup[]>;
    createOutlet(data : Partial<TableGroup>, transaction? : Transaction) : Promise<TableGroup>;
}

export class TableGroupRepository implements ITableGroupRepository {
    findTableGroupById(id: number): Promise<TableGroup | null> {
        return TableGroup.findOne({
            where: {
                id : id,
                archived : false
            }
        });
    }
    findTableGroupByName(groupName: string, outletId: string): Promise<TableGroup | null> {
        return TableGroup.findOne({
            where: {
                outlet_id : outletId,
                group_name : {
                    [Op.iLike] : groupName,
                },
                archived : false,
            }
        });
    }
    findAllTableGroup(organizationId: string): Promise<TableGroup[]> {
        return TableGroup.findAll({
            where : {
                organization_id : organizationId,
                archived : false,
            }
        });
    }
    findTableGroupByOutlet(outletId: string, organizationId: string): Promise<TableGroup[]> {
        return TableGroup.findAll({
            where : {
                outlet_id : outletId,
                organization_id : organizationId,
                archived : false,
            }
        });
    }
    createOutlet(data: Partial<TableGroup>, transaction?: Transaction): Promise<TableGroup> {
        return TableGroup.create(data, { transaction })
    }
}