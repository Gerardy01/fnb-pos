
// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import { IChangeTableGroupStatusData, IChangeTableStatusData, ICreateTableData, ICreateTableGroupData, IEditTableData, IEditTableGroupData, TableGroupReturnData, TableReturnData } from "../interfaces/ITable";
import { ITableGroupRepository } from "../repositories/tableGroupRepository";
import { IOutletRepository } from "../repositories/outletRepository";
import { ITableRepository } from "../repositories/tableRepository";
export interface ITableService {
    getAllTableGroup(organizationId : string, outletId? : string, includeTableCount? : string) : Promise<TableGroupReturnData[]>
    getOneTableGroup(tableGroupId : number, organizationId : string) : Promise<TableGroupReturnData>
    createTableGroup(data : ICreateTableGroupData, organizationId : string, transaction? : Transaction) : Promise<TableGroupReturnData>
    editTableGroup(data : IEditTableGroupData, organizationId : string, transaction? : Transaction) : Promise<TableGroupReturnData>
    deleteTableGroup(tableGroupId : number, organizationId : string, transaction? : Transaction) : Promise<boolean>
    changeTableGroupStatus(data : IChangeTableGroupStatusData, organizationId : string) : Promise<boolean>
    getAllTable(organizationId : string, tableGroupId? : number) : Promise<TableReturnData[]>
    getOneTable(tableId : number, organizationId : string) : Promise<TableReturnData>
    createTable(data : ICreateTableData, organizationId : string, transaction? : Transaction) : Promise<TableReturnData>
    editTable(data : IEditTableData, organizationId : string, transaction? : Transaction) : Promise<TableReturnData>
    changeTableStatus(data : IChangeTableStatusData, organizationId : string) : Promise<boolean>
    deleteTable(tableId : number, organizationId : string, transaction? : Transaction) : Promise<boolean>
}



export class TableService implements ITableService {
    constructor (
        private tableRepository : ITableRepository,
        private tableGroupRepository : ITableGroupRepository,
        private outletRepository : IOutletRepository,
    ) {}

    async getAllTableGroup(organizationId: string, outletId? : string, includeTableCount? : string): Promise<TableGroupReturnData[]> {

        let tableGroups = [];

        const includeTable = includeTableCount === "true" ? true : false;

        if (outletId) {
            tableGroups = await this.tableGroupRepository.findTableGroupByOutlet(outletId, organizationId, includeTable);
        } else {
            tableGroups = await this.tableGroupRepository.findAllTableGroup(organizationId, includeTable);
        }

        const tableGroupList : TableGroupReturnData[] = [];
        tableGroups.forEach(item => {
            tableGroupList.push({
                id : item.id,
                groupName : item.group_name,
                outletId : item.outlet_id,
                status : item.status,
                tableCount : Number(item.dataValues.table_count) ?? 0
            });
        });

        return tableGroupList;
    }

    async getOneTableGroup(tableGroupId : number, organizationId: string): Promise<TableGroupReturnData> {

        const tableGroup = await this.tableGroupRepository.findTableGroupById(tableGroupId);
        if (!tableGroup || tableGroup.organization_id !== organizationId) throw new DataNotFound("Data not found");

        return {
            id : tableGroup.id,
            groupName : tableGroup.group_name,
            outletId : tableGroup.outlet_id,
            status : tableGroup.status,
            tableCount : 0
        }
    }

    async createTableGroup(data: ICreateTableGroupData, organizationId: string, transaction?: Transaction): Promise<TableGroupReturnData> {
        
        // check outlet exist
        const outlet = await this.outletRepository.findOutletById(data.outletId);
        if (!outlet || outlet.organization_id !== organizationId) throw new DataNotFound("outlet not found");

        // check name already exist
        const tableGroupExist = await this.tableGroupRepository.findTableGroupByName(data.groupName, outlet.outlet_id);
        if (tableGroupExist) throw new ExistData("TABLE409-1");
        
        const newTableGroup = await this.tableGroupRepository.createTableGroup({
            group_name : data.groupName,
            outlet_id : outlet.outlet_id,
            organization_id : organizationId
        }, transaction);

        return {
            id : newTableGroup.id,
            groupName : newTableGroup.group_name,
            outletId : newTableGroup.outlet_id,
            status : newTableGroup.status,
            tableCount : 0
        }
    }

    async editTableGroup(data: IEditTableGroupData, organizationId: string, transaction?: Transaction): Promise<TableGroupReturnData> {
        
        // check table group exist
        const targetTableGroup = await this.tableGroupRepository.findTableGroupById(data.id);
        if (!targetTableGroup || targetTableGroup.organization_id !== organizationId) throw new DataNotFound("TableGroup not found");

        // check name already exist
        const tableGroupExist = await this.tableGroupRepository.findTableGroupByName(data.groupName, targetTableGroup.outlet_id);
        if (tableGroupExist && tableGroupExist.id !== targetTableGroup.id) throw new ExistData("TABLE409-1");

        targetTableGroup.group_name = data.groupName;
        await targetTableGroup.save({ transaction });

        return {
            id : targetTableGroup.id,
            groupName : targetTableGroup.group_name,
            outletId : targetTableGroup.outlet_id,
            status : targetTableGroup.status,
        }
    }

    async deleteTableGroup(tableGroupId: number, organizationId: string, transaction? : Transaction): Promise<boolean> {
        
        // check table group exist
        const targetTableGroup = await this.tableGroupRepository.findTableGroupById(tableGroupId);
        if (!targetTableGroup || targetTableGroup.organization_id !== organizationId) throw new DataNotFound("TableGroup not found");

        // TODO : Probably going to need to add another validation in the future

        targetTableGroup.status = false;
        targetTableGroup.archived = true;

        await targetTableGroup.save({ transaction });

        return true;
    }

    async changeTableGroupStatus(data: IChangeTableGroupStatusData, organizationId: string): Promise<boolean> {
        
        // check table group exist
        const targetTableGroup = await this.tableGroupRepository.findTableGroupById(data.id);
        if (!targetTableGroup || targetTableGroup.organization_id !== organizationId) throw new DataNotFound("TableGroup not found");

        // TODO : Probably going to need to add another validation in the future

        targetTableGroup.status = data.newStatus;
        targetTableGroup.save();

        return targetTableGroup.status;
    }

    async getAllTable(organizationId: string, tableGroupId?: number): Promise<TableReturnData[]> {
        
        let tables = [];

        if (tableGroupId) {
            tables = await this.tableRepository.findTableByTableGroup(tableGroupId, organizationId);
        } else {
            tables = await this.tableRepository.findAllTable(organizationId);
        }

        const tableList : TableReturnData[] = [];
        tables.forEach(item => {
            tableList.push({
                tableId : item.table_id,
                tableName : item.table_name,
                pax : item.pax,
                tableGroupId : item.table_group_id,
                operationalStatus : item.operational_status,
                status : item.status,
                effectiveStatus : item.effective_status,
            });
        });

        return tableList;
    }

    async getOneTable(tableId: number, organizationId: string): Promise<TableReturnData> {
        
        const table = await this.tableRepository.findTableById(tableId);
        if (!table || table.table_group?.organization_id !== organizationId) throw new DataNotFound("Data not found");

        return {
            tableId : table.table_id,
            tableName : table.table_name,
            pax : table.pax,
            tableGroupId : table.table_group_id,
            operationalStatus : table.operational_status,
            status : table.status,
            effectiveStatus : table.effective_status,
        }
    }

    async createTable(data: ICreateTableData, organizationId: string, transaction? : Transaction): Promise<TableReturnData> {
        
        // check table group exist
        const tableGroup = await this.tableGroupRepository.findTableGroupWithOutlet(data.tableGroupId);
        if (!tableGroup || tableGroup.organization_id !== organizationId) throw new DataNotFound("TableGroup not found");

        // check name already exist
        const existTable = await this.tableRepository.findTableByName(data.tableName, data.tableGroupId);
        if (existTable) throw new ExistData("TABLE409-2");

        // define effective status
        const outlet = tableGroup.outlet;
        if (!outlet) throw new Error("something wrong when getting outlet");
        const effectiveStatus : boolean = outlet.status && tableGroup.status;

        const createdTable = await this.tableRepository.createTable({
            table_name : data.tableName,
            pax : data.pax,
            table_group_id : tableGroup.id,
            effective_status : effectiveStatus,
        }, transaction);

        return {
            tableId : createdTable.table_id,
            tableName : createdTable.table_name,
            pax : createdTable.pax,
            tableGroupId : createdTable.table_group_id,
            operationalStatus : createdTable.operational_status,
            status : createdTable.status,
            effectiveStatus : createdTable.effective_status,
        }
    }

    async editTable(data: IEditTableData, organizationId: string, transaction?: Transaction): Promise<TableReturnData> {
        
        // check table exist
        const targetTable = await this.tableRepository.findTableById(data.tableId);
        if (!targetTable || targetTable.table_group?.organization_id !== organizationId) throw new DataNotFound("Data not found");

        // check name already exist
        const existTable = await this.tableRepository.findTableByName(data.tableName, targetTable.table_group_id);
        if (existTable && existTable.table_id !== targetTable.table_id) throw new ExistData("TABLE409-2");

        targetTable.table_name = data.tableName;
        targetTable.pax = data.pax;

        await targetTable.save({ transaction });

        return {
            tableId : targetTable.table_id,
            tableName : targetTable.table_name,
            pax : targetTable.pax,
            tableGroupId : targetTable.table_group_id,
            operationalStatus : targetTable.operational_status,
            status : targetTable.status,
            effectiveStatus : targetTable.effective_status,
        }
    }

    async changeTableStatus(data: IChangeTableStatusData, organizationId: string): Promise<boolean> {
        
        const targetTable = await this.tableRepository.findTableById(data.tableId);
        if (!targetTable || targetTable.table_group?.organization_id !== organizationId) throw new DataNotFound("Data not found");

        targetTable.status = data.newStatus;
        targetTable.save();

        return targetTable.status;
    }

    async deleteTable(tableId: number, organizationId: string, transaction?: Transaction): Promise<boolean> {
        
        const targetTable = await this.tableRepository.findTableById(tableId);
        if (!targetTable || targetTable.table_group?.organization_id !== organizationId) throw new DataNotFound("Data not found");

        targetTable.status = false;
        targetTable.effective_status = false;
        targetTable.archived = true;

        targetTable.save({ transaction });

        return true;
    }
}