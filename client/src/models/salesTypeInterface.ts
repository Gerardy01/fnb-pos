

export interface AssignedGratuities {
    gratuityId : number;
    outletId : string | null;
}

export interface SalesTypeReturnData {
    salesTypeId : number;
    name : string;
}

export interface SalesTypeCompleteDataReturn {
    salesTypeId : number;
    name : string;
    outletIds : string[];
    assignedGratuities : AssignedGratuities[];
}

export interface CreateSalesTypeBodyData {
    name : string;
    outletIds : string[];
    assignedGratuities : AssignedGratuities[];
}

export interface EditSalesTypeBodyData {
    salesTypeId : number;
    name : string;
    outletIds : string[];
    assignedGratuities : AssignedGratuities[];
}