


export interface GratuityDataReturn {
    gratuityId : number;
    name : string;
    writtenName : string;
    amount : string;
    calculationType : number;
}

export interface CreateGratuityBodyData {
    name : string;
    writtenName : string;
    amount : string;
    calculationType : number;
}