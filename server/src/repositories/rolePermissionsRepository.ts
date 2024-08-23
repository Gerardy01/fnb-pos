import RolePermissions from "../models/rolePermission.model";

// types and interfaces
import { Transaction } from "sequelize";
export interface IRolePermissionsRepository {
    bulkCreateRolePermissions(data : Partial<RolePermissions>[], transaction? : Transaction) : Promise<RolePermissions[]>
    findPermissionByRole(roleId : number) : Promise<RolePermissions[]>
}



export class RolePermissionsRepository implements IRolePermissionsRepository {
    bulkCreateRolePermissions(data: Partial<RolePermissions>[], transaction? : Transaction): Promise<RolePermissions[]> {
        return RolePermissions.bulkCreate(data, { transaction });
    }

    findPermissionByRole(roleId: number): Promise<RolePermissions[]> {
        return RolePermissions.findAll({
            where: {
                role_id : roleId
            }
        })
    }
}