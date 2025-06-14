


export interface ICreateOutletData {
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
}

export interface IEditOutletData {
    outletId : string;
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
}

export interface IChangeOutletStatusData {
    outletId : string;
    newStatus : boolean;
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