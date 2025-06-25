
// utils
import { DataNotFound, ExistData, Forbidden } from "../utility/exceptions";
import { EventTypeEnum } from "../utility/enums";

// types and interfaces
import { Transaction } from "sequelize";
import { IChangeTableGroupStatusData, IChangeTableStatusData, ICreateTableData, ICreateTableGroupData, IEditTableData, IEditTableGroupData, TableGroupReturnData, TableReturnData } from "../interfaces/ITable";
import { ITableGroupRepository } from "../repositories/tableGroupRepository";
import { IOutletRepository } from "../repositories/outletRepository";
import { ITableRepository } from "../repositories/tableRepository";
import { DomainEvent, IEventPublisherProvider } from "../providers/eventPublisherProvider";
import { Table } from "../models";
export interface ITableService {
    getAllTableGroup(organizationId : string, outletId? : string, includeTableCount? : string) : Promise<TableGroupReturnData[]>
    getOneTableGroup(tableGroupId : number, organizationId : string) : Promise<TableGroupReturnData>
    createTableGroup(data : ICreateTableGroupData, organizationId : string, transaction? : Transaction) : Promise<TableGroupReturnData>
    editTableGroup(data : IEditTableGroupData, organizationId : string, transaction? : Transaction) : Promise<TableGroupReturnData>
    deleteTableGroup(tableGroupId : number, organizationId : string, deleteUnder? : string, transaction? : Transaction) : Promise<boolean>
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
        private eventPublisherProvider : IEventPublisherProvider,
    ) {
        eventPublisherProvider.subscribe(EventTypeEnum.TABLE_GROUP_STATUS_UPDATED, this.handleTableGroupStatusUpdate.bind(this));
        eventPublisherProvider.subscribe(EventTypeEnum.OUTLET_STATUS_UPDATED, this.handleOutletStatusUpdate.bind(this));
        eventPublisherProvider.subscribe(EventTypeEnum.TABLE_STATUS_UPDATED, this.handleTableStatusUpdate.bind(this));
        eventPublisherProvider.subscribe(EventTypeEnum.TABLE_GROUP_DELETED, this.handleTableGroupDeleted.bind(this));
        eventPublisherProvider.subscribe(EventTypeEnum.OUTLET_DELETED, this.handleOutletDeleted.bind(this));
    }

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

    async deleteTableGroup(tableGroupId: number, organizationId: string, deleteUnder? : string, transaction? : Transaction): Promise<boolean> {
        
        // check table group exist
        const targetTableGroup = await this.tableGroupRepository.findTableGroupById(tableGroupId);
        if (!targetTableGroup || targetTableGroup.organization_id !== organizationId) throw new DataNotFound("TableGroup not found");

        const deleteTableUnder = deleteUnder === "true" ? true : false;

        if (!deleteTableUnder) {
            const tables = await this.tableRepository.findTableByTableGroup(targetTableGroup.id, organizationId);
            if (tables.length > 0) throw new Forbidden("Table with this Table Group exist");
        }

        targetTableGroup.status = false;
        targetTableGroup.archived = true;

        await targetTableGroup.save({ transaction });

        if (deleteTableUnder) {
            await this.eventPublisherProvider.publish({
                type : EventTypeEnum.TABLE_GROUP_DELETED,
                payload : {
                    tableGroupId : targetTableGroup.id,
                    organizationId : organizationId,
                },
                timestamp : new Date(),
            });
        }

        return true;
    }

    async changeTableGroupStatus(data: IChangeTableGroupStatusData, organizationId: string): Promise<boolean> {
        
        // check table group exist
        const targetTableGroup = await this.tableGroupRepository.findTableGroupById(data.id);
        if (!targetTableGroup || targetTableGroup.organization_id !== organizationId) throw new DataNotFound("TableGroup not found");

        targetTableGroup.status = data.newStatus;
        await targetTableGroup.save();

        await this.eventPublisherProvider.publish({
            type : EventTypeEnum.TABLE_GROUP_STATUS_UPDATED,
            payload : {
                tableGroupId : targetTableGroup.id,
                organizationId : organizationId,
            },
            timestamp : new Date(),
        });

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
        await targetTable.save();

        await this.eventPublisherProvider.publish({
            type : EventTypeEnum.TABLE_STATUS_UPDATED,
            payload : {
                tableId : targetTable.table_id,
            },
            timestamp : new Date(),
        });

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

    private async handleTableGroupStatusUpdate(event : DomainEvent) : Promise<void> {
        const { tableGroupId, organizationId } = event.payload;

        try {
            const tableGroup = await this.tableGroupRepository.findTableGroupById(tableGroupId);
            if (!tableGroup) return;
    
            const outlet = await this.outletRepository.findOutletById(tableGroup.outlet_id);
            if (!outlet) return;
    
            const tables = await this.tableRepository.findTableByTableGroup(tableGroupId, organizationId);
    
            const updatedTables = tables.map(table => ({
                table_id: table.table_id,
                effective_status: !!(table.status && tableGroup.status && outlet.status),
                updated_at: new Date()
            }));
            
            this.tableRepository.bulkUpdateEffectiveStatus(updatedTables);

        } catch(e) {
            // ADD-ONS : Add logger if there is
            console.log(e);
        }
    }

    private async handleOutletStatusUpdate(event : DomainEvent) : Promise<void> {
        const { outletId, organizationId } = event.payload;

        try {
            const outlet = await this.outletRepository.findOutletById(outletId);
            if (!outlet) return;
    
            const tableGroups = await this.tableGroupRepository.findTableGroupByOutlet(outletId, organizationId);
    
            const allTables = await Promise.all(
                tableGroups.map(group =>
                    this.tableRepository.findTableByTableGroup(group.id, organizationId)
                )
            );
    
            const updates: { table_id: number; effective_status: boolean }[] = [];
    
            for (let i = 0; i < tableGroups.length; i++) {
                const group = tableGroups[i];
                const tables = allTables[i];
    
                tables.forEach(table => {
                    const newEffectiveStatus = !!(table.status && group.status && outlet.status);
                    updates.push({ table_id: table.table_id, effective_status: newEffectiveStatus });
                });
            }
    
            if (updates.length === 0) return;
    
            await this.tableRepository.bulkUpdateEffectiveStatus(updates);

        } catch(e) {
            // ADD-ONS : Add logger if there is
            console.log(e);
        }
    }

    private async handleTableStatusUpdate(event: DomainEvent): Promise<void> {
        const { tableId } = event.payload;
        
        try {
            const table = await this.tableRepository.findTableById(tableId);
            if (!table) return;
            
            const tableGroup = await this.tableGroupRepository.findTableGroupById(table.table_group_id);
            if (!tableGroup) return;
            
            const outlet = await this.outletRepository.findOutletById(tableGroup.outlet_id);
            if (!outlet) return;
            
            const newEffectiveStatus = !!(table.status && tableGroup.status && outlet.status);
            table.effective_status = newEffectiveStatus;
            table.save();
            
        } catch(e) {
            // ADD-ONS : Add logger if there is
            console.log(e);
        }
    }

    private async handleTableGroupDeleted(event: DomainEvent): Promise<void> {
        const { tableGroupId, organizationId } = event.payload;

        try {

            const tables = await this.tableRepository.findTableByTableGroup(tableGroupId, organizationId);
            const tableIds = tables.map(item => item.table_id);

            this.tableRepository.bulkDeleteTable(tableIds);

        } catch(e) {
            // ADD-ONS : Add logger if there is
            console.log(e);
        }
    }

    private async handleOutletDeleted(event: DomainEvent): Promise<void> {
        const { outletId, organizationId } = event.payload;

        try {

            const tableGroups = await this.tableGroupRepository.findTableGroupByOutlet(outletId, organizationId);
    
            const allTables = await Promise.all(
                tableGroups.map(group =>
                    this.tableRepository.findTableByTableGroup(group.id, organizationId)
                )
            );

            const tableIds : number[] = [];
            allTables.forEach(e => {
                tableIds.push(...e.map(item => item.table_id));
            });

            const tableGroupIds = tableGroups.map(item => item.id);

            this.tableGroupRepository.bulkDeleteTableGroup(tableGroupIds);
            this.tableRepository.bulkDeleteTable(tableIds);
            
        } catch(e) {
            // ADD-ONS : Add logger if there is
            console.log(e);
        }
    }
}