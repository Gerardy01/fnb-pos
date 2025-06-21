


export interface ICreateTableGroupData {
    groupName : string;
    outletId : string;
}

export interface IEditTableGroupData {
    id : number;
    groupName : string;
}

export interface IChangeTableGroupStatusData {
    id : number;
    newStatus : boolean;
}

export interface ICreateTableData {
    tableName : string;
    pax : number;
    tableGroupId : number;
}

export type TableGroupReturnData = {
    id : number;
    groupName : string;
    outletId : string;
    status : boolean;
    tableCount? : number;
}

export type TableReturnData = {
    tableId : number
    tableName : string;
    pax : number;
    tableGroupId : number;
    operationalStatus : number;
    status : boolean;
    effectiveStatus : boolean;
}