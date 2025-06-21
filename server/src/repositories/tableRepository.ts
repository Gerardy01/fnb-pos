import { Op, Transaction } from "sequelize";
import { Table, TableGroup } from "../models";



export interface ITableRepository {
    findTableByName(tableName : string, tableGroupId : number) : Promise<Table | null>
    findAllTable(organizationId : string) : Promise<Table[]>
    findTableByTableGroup(tableGroupId : number, organizationId : string) : Promise<Table[]>
    createTable(data : Partial<Table>, transaction? : Transaction) : Promise<Table>
}

export class TableRepository implements ITableRepository {
    findTableByName(tableName: string, tableGroupId: number): Promise<Table | null> {
        return Table.findOne({
            where : {
                table_group_id : tableGroupId,
                table_name : {
                    [Op.iLike] : tableName,
                },
                archived : false,
            }
        });
    }

    findAllTable(organizationId: string): Promise<Table[]> {
        return Table.findAll({
            where : {
                archived : false,
            },
            include : [
                {
                    model: TableGroup,
                    as: "table_group",
                    where: {
                        organization_id: organizationId,
                    },
                    attributes: [],
                }
            ]
        });
    }

    findTableByTableGroup(tableGroupId: number, organizationId: string): Promise<Table[]> {
        return Table.findAll({
            where : {
                table_group_id : tableGroupId,
                archived : false,
            },
            include : [
                {
                    model: TableGroup,
                    as: "table_group",
                    where: {
                        organization_id: organizationId,
                    },
                    attributes: [],
                }
            ]
        });
    }

    createTable(data: Partial<Table>, transaction?: Transaction): Promise<Table> {
        return Table.create(data, { transaction });
    }
}