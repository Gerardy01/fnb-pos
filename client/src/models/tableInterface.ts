


export interface TableGroupDataReturn {
    id : number;
    groupName : string;
    outletId : string;
    status : boolean;
    tableCount : number;
}

export interface CreateTableGroupBodyData {
    groupName : string;
    outletId : string;
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