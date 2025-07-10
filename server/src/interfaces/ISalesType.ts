

export interface AssignedGratuities {
    gratuityId : number;
    outletId? : string;
}

export interface ICreateSalesTypeData {
    name : string;
    outletIds : string[];
    assignedGratuities : AssignedGratuities[];
}

export type SalesTypeReturnData = {
    salesTypeId : number;
    name : string;
}

export type SalesTypeCompleteReturnData = {
    salesTypeId : number;
    name : string;
    outletIds : string[];
    assignedGratuities : AssignedGratuities[];
}