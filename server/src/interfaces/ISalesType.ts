

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
    sales_type_id : number;
    name : string;
}

export type SalesTypeCompleteReturnData = {
    sales_type_id : number;
    name : string;
    outletIds : string[];
    assignedGratuities : AssignedGratuities[];
}