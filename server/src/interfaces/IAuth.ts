import { IRolePermissionData } from "./IRolePermission";


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
    organizationExpiryDate : Date;
    accountId : string;
    accountRoleId : number;
    accountRoleName : string;
    permissions : IRolePermissionData[]
}

export interface IGenerateOtpData {
    address : string;
    expired_second : number;
}

export type LoginReturnData = {
    accessToken : string;
    refreshToken : string;
}