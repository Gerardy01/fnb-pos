
export interface IRolePermissionData {
    permissionId : number;
    read : boolean;
    write : boolean;
}

export interface ICreateRoleData {
    roleName : string;
    permissions : IRolePermissionData[];
}

export type RoleReturnData = {
    roleId : number;
    roleName : string;
}

export type RoleWithPermissionReturnData = {
    roleId : number;
    roleName : string;
    permissions : IRolePermissionData[];
}