

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
export interface CreateRoleData {
    roleName : string;
    description? : string;
    permissions : RolePermission[]
    pageAccessPermissionIds : number[]
}

export interface EditRoleData {
    roleId : number;
    roleName : string;
    description? : string;
    permissions : RolePermission[]
    pageAccessPermissionIds : number[]
}

export interface OneRoleData {
    roleId : number;
    roleName : string;
    description : string;
    permissions : RolePermission[]
    pageAccessPermissionIds : number[]
}