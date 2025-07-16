


export interface TaxDataReturn {
    taxId : number;
    name : string;
    writtenName : string;
    amount : string;
}

export interface TaxCompleteDataReturn {
    taxId : number;
    name : string;
    writtenName : string;
    amount : string;
    outletIds : string[];
}

export interface CreateTaxBodyData {
    name : string;
    writtenName : string;
    amount : string;
    outletIds : string[];
}

export interface EditTaxBodyData {
    taxId : number;
    name : string;
    writtenName : string;
    amount : string;
    outletIds : string[];
}