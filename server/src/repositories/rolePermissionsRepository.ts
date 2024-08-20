import RolePermissions from "../models/rolePermission.model";

// types and interfaces
import { Transaction } from "sequelize";
export interface IRolePermissionsRepository {
    bulkCreateRolePermissions(data : Partial<RolePermissions>[], transaction? : Transaction) : Promise<RolePermissions[]>
}



export class RolePermissionsRepository implements IRolePermissionsRepository {
    bulkCreateRolePermissions(data: Partial<RolePermissions>[], transaction? : Transaction): Promise<RolePermissions[]> {
        return RolePermissions.bulkCreate(data, { transaction });
    }
}