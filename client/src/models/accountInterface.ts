


export interface AccountInfoReturn {
    accountId : string;
    username : string;
    name : string;
    email : string;
    roleId : number;
    roleName : string;
    pageAccessPermissions : number[];
}

export interface AccountDataReturn {
    accountId : string;
    username : string;
    name : string;
    email : string;
    organizationId : string;
    roleId : number;
    roleName : string;
    archived : boolean;
}

export interface CheckAvailabilityReturn {
    available : boolean;
}

export interface CheckAvailabilityQueryParams {
    username? : string;
    email? : string;
}

export interface ChangePasswordBodyData {
    currentPassword : string;
    newPassword : string;
}

export interface EditAccountBodyData {
    accountId : string;
    process : string;
    value : string;
}

export interface EditAccountReturn {
    newValue : string;
}

export interface ChangePasswordData {
    oldPassword : string;
    newPassword : string;
}