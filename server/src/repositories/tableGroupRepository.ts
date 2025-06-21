import { col, fn, Op, Transaction } from "sequelize";
import { Outlet, Table, TableGroup } from "../models";



export interface ITableGroupRepository {
    findTableGroupById(id : number) : Promise<TableGroup | null>
    findTableGroupWithOutlet(id : number) : Promise<TableGroup | null>
    findTableGroupByName(groupName : string, outletId : string) : Promise<TableGroup | null>
    findAllTableGroup(organizationId : string, includeTableCount? : boolean) : Promise<TableGroup[]>;
    findTableGroupByOutlet(outletId : string, organizationId : string, includeTableCount? : boolean) : Promise<TableGroup[]>;
    createTableGroup(data : Partial<TableGroup>, transaction? : Transaction) : Promise<TableGroup>;
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
    findTableGroupWithOutlet(id: number): Promise<TableGroup | null> {
        return TableGroup.findOne({
            where: {
                id : id,
                archived : false
            },
            include: [
                {
                    model: Outlet,
                    as: 'outlet',
                },
            ],
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
    findAllTableGroup(organizationId: string, includeTableCount? : boolean): Promise<TableGroup[]> {
        if (includeTableCount) {
            return TableGroup.findAll({
                where : {
                    organization_id : organizationId,
                    archived : false,
                },
                attributes: {
                    include: [
                        [fn("COUNT", col("table.table_id")), "table_count"]
                    ],
                },
                include: [
                    {
                        model: Table,
                        as: "table",
                        attributes: [],
                        where: {
                            archived: false,
                        },
                        required: false,
                    },
                ],
                group: ["TableGroup.id"],
            });
        }

        return TableGroup.findAll({
            where : {
                organization_id : organizationId,
                archived : false,
            }
        });
    }
    findTableGroupByOutlet(outletId: string, organizationId: string, includeTableCount? : boolean): Promise<TableGroup[]> {
        if (includeTableCount) {
            return TableGroup.findAll({
                where : {
                    outlet_id : outletId,
                    organization_id : organizationId,
                    archived : false,
                },
                attributes: {
                    include: [
                        [fn("COUNT", col("table.table_id")), "table_count"]
                    ],
                },
                include: [
                    {
                        model: Table,
                        as: "table",
                        attributes: [],
                        where: {
                            archived: false,
                        },
                        required: false,
                    },
                ],
                group: ["TableGroup.id"],
            });
        }

        return TableGroup.findAll({
            where : {
                outlet_id : outletId,
                organization_id : organizationId,
                archived : false,
            }
        });
    }
    createTableGroup(data: Partial<TableGroup>, transaction?: Transaction): Promise<TableGroup> {
        return TableGroup.create(data, { transaction });
    }
}