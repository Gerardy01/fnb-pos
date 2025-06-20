


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

export type TableGroupReturnData = {
    id : number;
    groupName : string;
    outletId : string;
    status : boolean;
    tableCount? : number;
}