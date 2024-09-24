import { IRolePermissionData } from "./IRole";


export interface ILoginData {
    identifier : string;
    password : string;
}

export interface ISuperAdminLoginData extends ILoginData {
    organizationNo : string;
}

export interface IAccessTokenBody {
    username : string;
    organizationId : string;
    accountId : string;
    accountRoleId : number;
    accountRoleName : string;
    permissions : IRolePermissionData[]
}

export type LoginReturnData = {
    accessToken : string;
    refreshToken : string;
}