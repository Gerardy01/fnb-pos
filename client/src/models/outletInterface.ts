


export interface OutletDataReturn {
    outletId : string;
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
    status : boolean;
}

export interface ChangeOutletStatusDataReturn {
    newStatus : boolean;
}

export interface CreateOutletBodyData {
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
}

export interface EditOutletBodyData {
    outletId : string;
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
}

export interface ChangeOutletStatusBodyData {
    outletId : string;
    newStatus : boolean;
}