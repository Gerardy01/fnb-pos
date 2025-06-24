


export interface TableGroupDataReturn {
    id : number;
    groupName : string;
    outletId : string;
    status : boolean;
    tableCount : number;
}

export interface TableDataReturn {
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

export interface ChangeTableStatusBodyData {
    tableId : number;
    newStatus : boolean;
}

export interface ChangeTableStatusDataReturn {
    newStatus : boolean;
}

export interface EditTableGroupBodyData {
    id : number;
    groupName : string;
}

export interface EditTableBodyData {
    tableId : number;
    tableName : string;
    pax : number;
}