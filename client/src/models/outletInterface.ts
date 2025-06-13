


export interface OutletDataReturn {
    outletId : string;
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
    status : boolean;
}


export interface CreateOutletBodyData {
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
}