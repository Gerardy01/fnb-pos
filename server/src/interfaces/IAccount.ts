


export interface ICreateAccountData {
    username : string;
    name : string;
    email : string;
    password : string;
    organizationId : string;
    roleId : number;
}

export interface ICreateAccountForManagementData {
    username : string;
    name : string;
    email : string;
    password : string;
    organizationId : string;
}

export interface IAccountDataReturn {
    accountId : string;
    username : string;
    name : string;
    email : string;
    organizationId : string;
    roleId : number;
    roleName : string;
    archived : boolean;
}