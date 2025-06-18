
// utils
import { DataNotFound, ExistData } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import { ICreateTableGroupData, IEditTableGroupData, TableGroupReturnData } from "../interfaces/ITable";
import { ITableGroupRepository } from "../repositories/tableGroupRepository";
import { IOutletRepository } from "../repositories/outletRepository";
export interface ITableService {
    getAllTableGroup(organizationId : string, outletId? : string) : Promise<TableGroupReturnData[]>
    createTableGroup(data : ICreateTableGroupData, organizationId : string, transaction? : Transaction) : Promise<TableGroupReturnData>
    editTableGroup(data : IEditTableGroupData, organizationId : string, transaction? : Transaction) : Promise<TableGroupReturnData>
}



export class TableService implements ITableService {
    constructor (
        private tableGroupRepository : ITableGroupRepository,
        private outletRepository : IOutletRepository,
    ) {}

    async getAllTableGroup(organizationId: string, outletId? : string): Promise<TableGroupReturnData[]> {

        let tableGroups = [];

        if (outletId) {
            tableGroups = await this.tableGroupRepository.findTableGroupByOutlet(outletId, organizationId);
        } else {
            tableGroups = await this.tableGroupRepository.findAllTableGroup(organizationId);
        }

        const tableGroupList : TableGroupReturnData[] = [];
        tableGroups.forEach(item => {
            tableGroupList.push({
                id : item.id,
                groupName : item.group_name,
                status : item.status,
                tableCount : 0
            });
        });

        return tableGroupList;
    }

    async createTableGroup(data: ICreateTableGroupData, organizationId: string, transaction?: Transaction): Promise<TableGroupReturnData> {
        
        // check outlet exist
        const outlet = await this.outletRepository.findOutletById(data.outletId);
        if (!outlet || outlet.organization_id !== organizationId) throw new DataNotFound("outlet not found");

        // check name already exist
        const tableGroupExist = await this.tableGroupRepository.findTableGroupByName(data.groupName, outlet.outlet_id);
        if (tableGroupExist) throw new ExistData("TABLE409-1");
        
        const newTableGroup = await this.tableGroupRepository.createOutlet({
            group_name : data.groupName,
            outlet_id : outlet.outlet_id,
            organization_id : organizationId
        }, transaction);

        return {
            id : newTableGroup.id,
            groupName : newTableGroup.group_name,
            status : newTableGroup.status,
            tableCount : 0
        }
    }

    async editTableGroup(data: IEditTableGroupData, organizationId: string, transaction?: Transaction): Promise<TableGroupReturnData> {
        
        // check table group exist
        const targetTableGroup = await this.tableGroupRepository.findTableGroupById(data.id);
        if (!targetTableGroup || targetTableGroup.organization_id !== organizationId) throw new DataNotFound("TableGroup not found")

        // check name already exist
        const tableGroupExist = await this.tableGroupRepository.findTableGroupByName(data.groupName, targetTableGroup.outlet_id);
        if (tableGroupExist && tableGroupExist.id !== targetTableGroup.id) throw new ExistData("TABLE409-1");

        targetTableGroup.group_name = data.groupName;
        targetTableGroup.save({ transaction });

        return {
            id : targetTableGroup.id,
            groupName : targetTableGroup.group_name,
            status : targetTableGroup.status,
        }
    }
}