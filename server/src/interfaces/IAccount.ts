


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

export type AccountInfoReturn = {
    accountId : string;
    username : string;
    name : string;
    email : string;
    roleId : number;
    roleName : string;
    pageAccessPermissions : number[];
}