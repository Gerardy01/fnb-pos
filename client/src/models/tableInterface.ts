


export interface TableGroupDataReturn {
    id : number;
    groupName : string;
    outletId : string;
    status : boolean;
    tableCount : number;
}

export interface TableReturnData {
    tableId : number
    tableName : string;
    pax : number;
    tableGroupId : number;
    operationalStatus : number;
    status : boolean;
    effectiveStatus : boolean;
}

export interface CreateTableGroupBodyData {
    groupName : string;
    outletId : string;
}

export interface CreateTableBodyData {
    tableName : string;
    pax : number;
    tableGroupId : number;
}

export interface ChangeTableGroupStatusBodyData {
    id : number;
    newStatus : boolean;
}

export interface ChangeTableGroupStatusDataReturn {
    newStatus : boolean;
}

export interface EditTableGroupBodyData {
    id : number;
    groupName : string;
}