


export interface ICreateAccountData {
    username : string;
    name : string;
    email : string;
    password : string;
    roleId : number;
}

export interface ICreateAccountForManagementData {
    username : string;
    name : string;
    email : string;
    password : string;
    organizationId : string;
}

export interface ICreateSuperAdminData {
    username : string;
    name : string;
    email : string;
    password : string;
}

export interface IChangePassword {
    currentPassword : string;
    newPassword : string;
}

export interface IEditAccount {
    accountId : string;
    process : string;
    value : string;
}

export interface IChangeUsername {
    accountId : string;
    newUsername : string;
}

export interface IChangeEmail {
    accountId : string;
    newEmail : string;
}

export interface IChangeName {
    accountId : string;
    newName : string;
}

export interface IResetPassword {
    accountId : string;
    newPassword : string;
}

export interface CheckAvailabilityQueryParams {
    username? : string;
    email? : string;
}

export type AccountDataReturn = {
    accountId : string;
    username : string;
    name : string;
    email : string;
    organizationId : string;
    roleId : number;
    roleName : string;
    archived : boolean;
}

export type AccountDataReturnExtended = AccountDataReturn & {
    password : string;
}

export type AccountInfoReturn = {
    accountId : string;
    username : string;
    name : string;
    email : string;
    roleId : number;
    roleName : string;
    pageAccessPermissions : number[];
}

export type EditAccountReturn = {
    newValue : string;
    message : string;
}