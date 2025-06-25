import { Op, Sequelize, Transaction } from "sequelize";
import sequelize from "../config/database";

// models
import { Table, TableGroup } from "../models";



export interface ITableRepository {
    findTableByName(tableName : string, tableGroupId : number) : Promise<Table | null>
    findAllTable(organizationId : string) : Promise<Table[]>
    findTableById(id : number) : Promise<Table | null>
    findTableByTableGroup(tableGroupId : number, organizationId : string) : Promise<Table[]>
    findTableByTableGroups(tableGroupIds: number[], organizationId: string): Promise<Table[]>
    createTable(data : Partial<Table>, transaction? : Transaction) : Promise<Table>
    bulkUpdateEffectiveStatus(data : Partial<Table>[]) : Promise<void>
    bulkDeleteTable(tableIds : number[]) : Promise<void>
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

    findTableById(tableId: number): Promise<Table | null> {
        return Table.findOne({
            where : {
                table_id : tableId,
                archived : false,
            },
            include : [
                {
                    model: TableGroup,
                    as: "table_group",
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

    findTableByTableGroups(tableGroupIds: number[], organizationId: string): Promise<Table[]> {
        return Table.findAll({
            where: {
                table_group_id: {
                    [Op.in]: tableGroupIds,
                },
                archived: false,
            },
            include: [
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

    async bulkUpdateEffectiveStatus(data: Partial<Table>[]): Promise<void> {
        if (data.length === 0) return;

        const cases = data
            .map(item => `WHEN ${item.table_id} THEN ${item.effective_status}`)
            .join(' ');

        const ids = data.map(item => item.table_id).join(',');

        const sql = `
            UPDATE tables
            SET effective_status = CASE table_id
                ${cases}
            END
            WHERE table_id IN (${ids})
        `;

        await sequelize.query(sql);
    }

    async bulkDeleteTable(tableIds: number[]): Promise<void> {
        Table.update(
            {
                archived : true,
                status : false,
                effective_status : false,
            },
            {
                where : {
                    table_id : {
                        [Op.in]: tableIds,
                    }
                }
            }
        );
    }
}