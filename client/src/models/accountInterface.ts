


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

export interface CreateAccountBodyData {
    username : string;
    name : string;
    email : string | null;
    roleId : number;
    password : string;
    otpCode? : number;
    outletIds : string[];
}

export interface EditAccountManagementBodyData {
    accountId : string;
    username : string;
    name : string;
    email : string | null;
    roleId : number;
    otpCode? : number;
}

export interface EditAccountApiBodyData {
    accountId : string;
    username : string;
    name : string;
    email : string | null;
    roleId : number;
    otpCode? : number;
    outletIds : string[];
}

export interface ChangePasswordBodyData {
    currentPassword : string;
    newPassword : string;
}

export interface ForgotPassChange {
    newPassword : string;
    token : string;
}

export interface EditAccountBodyData {
    accountId : string;
    process : string;
    value : string;
    otpCode? : number;
}

export interface EditAccountReturn {
    newValue : string;
}

export interface ChangePasswordData {
    oldPassword : string;
    newPassword : string;
}

export interface CreateAccountData {
    username : string;
    name : string;
    email : string | null;
    role : number;
    password : string;
    confirmPassword : string;
    otpCode? : string;
}

export interface ResetPasswordData {
    newPassword : string;
}

export type OutletSelectionData = {
    outletId : string;
    outletName : string;
}