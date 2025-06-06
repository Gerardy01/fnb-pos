

export interface RoleDataReturn {
    roleId : number;
    roleName : string;
    description : string;
}

export interface RolePermission {
    permissionId: number,
    read: boolean,
    write: boolean
}

export interface OneRoleData {
    roleId : number;
    roleName : string;
    description : string;
    permissions : RolePermission[]
    pageAccessPermissionIds : number[]
}