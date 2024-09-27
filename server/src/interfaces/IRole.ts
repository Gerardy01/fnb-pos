
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
}

export type RoleReturnData = {
    roleId : number;
    roleName : string;
}

export type RoleWithPermissionReturnData = {
    roleId : number;
    roleName : string;
    permissions : IRolePermissionData[];
    pageAccessPermissionIds : number[];
}