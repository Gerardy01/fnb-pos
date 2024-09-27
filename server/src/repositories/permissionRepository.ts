import { Permission, RolePermissions } from "../models";

// types and interfaces
export interface IPermissionRepository {
    findAllPermission() : Promise<Permission[]>
    findByIds(permissionIds : number[]) : Promise<Permission[]>
    findPermissionByRole(roleId : number) : Promise<RolePermissions[]>
}



export class PermissionRepository implements IPermissionRepository {
    findAllPermission(): Promise<Permission[]> {
        return Permission.findAll();
    }

    findByIds(permissionIds: number[]): Promise<Permission[]> {
        return Permission.findAll({
            where: {
                permission_id: permissionIds,
            },
        });
    }

    findPermissionByRole(roleId: number): Promise<RolePermissions[]> {
        return RolePermissions.findAll({
            where: {
                role_id : roleId
            }
        })
    }
}