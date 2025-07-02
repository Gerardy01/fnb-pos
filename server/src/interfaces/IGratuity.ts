


export interface ICreateGratuityData {
    name : string;
    writtenName : string;
    amount : string;
    calculationType : number;
}

export interface IEditGratuityData {
    gratuityId : number;
    name : string;
    writtenName : string;
    amount : string;
    calculationType : number;
}

export type GratuityReturnData = {
    gratuityId : number;
    name : string;
    writtenName : string;
    amount : string;
    calculationType : number;
}