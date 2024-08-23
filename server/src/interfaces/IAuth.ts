import { IRolePermissionData } from "./IRole";


export interface ILoginData {
    identifier : string;
    password : string;
}

export interface ISuperAdminLoginData extends ILoginData {
    organizationId : string;
}

export interface IAccessTokenBody {
    username : string;
    organizationId : string;
    accountId : string;
    permissions : IRolePermissionData[]
}

export interface IRefreshTokenBody {
    accountId : string;
}

export type LoginReturnData = {
    accessToken : string;
    refreshToken : string;
}