
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

export type RoleReturnData = {
    roleId : number;
    roleName : string;
    description : string;
}

export type RoleWithPermissionReturnData = {
    roleId : number;
    roleName : string;
    description: string;
    permissions : IRolePermissionData[];
    pageAccessPermissionIds : number[];
}