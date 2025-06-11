


export interface ICreateOutletData {
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
}

export type OutletReturnData = {
    outletId : string;
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
    status : boolean;
}