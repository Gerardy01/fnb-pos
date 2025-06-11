
export interface IRolePermissionData {
    permissionId : number;
    permissionName? : string;
    read : boolean;
    write : boolean;
}

export interface ICreateRoleData {
    roleName : string;
    permissions : IRolePermissionData[];
    pageAccessPermissionIds : number[];
    description? : string;
}

export interface IEditRoleData {
    roleId : number;
    roleName : string;
    permissions : IRolePermissionData[];
    pageAccessPermissionIds : number[];
    description? : string;
}

export type RoleReturnData = {
    roleId : number;
    roleName : string;
    description : string;
    accountCount? : string;
}

export type RoleWithPermissionReturnData = {
    roleId : number;
    roleName : string;
    description: string;
    permissions : IRolePermissionData[];
    pageAccessPermissionIds : number[];
}

export type RoleWithPermissionAndCountReturnData = {
    roleId : number;
    roleName : string;
    description: string;
    permissions : IRolePermissionData[];
    pageAccessPermissionIds : number[];
    accountCount : number;
}

export type PageAccessPermissionReturnData = {
    permissionId : number;
    permissionName : string;
    description : string;
}

export type PermissionReturnData = {
    permissionId : number;
    permissionName : string;
    description : string;
}