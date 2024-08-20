import Permission from "../models/permission.model";

// types and interfaces
export interface IPermissionRepository {
    findAllPermission() : Promise<Permission[]>
    findByIds(permissionIds : number[]) : Promise<Permission[]>
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
}