


export interface ICreateTaxData {
    name : string;
    writtenName : string;
    amount : string;
    outletIds : string[];
}

export interface IEditTaxData {
    taxId : number;
    name : string;
    writtenName : string;
    amount : string;
    outletIds : string[];
}

export type TaxReturnData = {
    taxId : number;
    name : string;
    writtenName : string;
    amount : string;
}

export type TaxCompleteReturnData = {
    taxId : number;
    name : string;
    writtenName : string;
    amount : string;
    outletIds : string[];
}