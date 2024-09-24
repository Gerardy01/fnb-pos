import { Op } from "sequelize"
import Role from "../models/role.model"
import RolePermissions from "../models/rolePermission.model";
import RolePageAccessPermission from "../models/rolePageAccessPermission.model";

// utils
import { DefaultRoleEnum } from "../utility/enums"

// types and interfaces
import { Transaction } from "sequelize"
export interface IRoleRepository {
    findOneRole(id : number) : Promise<Role | null>
    findRoleByOrganization(organizationId : string) : Promise<Role[]>
    findRoleByName(name : string) : Promise<Role | null>
    findRoleByIdAndOrganization(id : number, organizationId : string) : Promise<Role | null>
    findRoleByNameAndOrganization(name : string, organizationId : string) : Promise<Role | null>
    findDefaultRole() : Promise<Role[]>
    findDefaultRoleByName(name : string) : Promise<Role | null>
    createRole(data : Partial<Role>, transaction? : Transaction) : Promise<Role>
    bulkCreateRolePermissions(data : Partial<RolePermissions>[], transaction? : Transaction) : Promise<RolePermissions[]>
    bulkCreateRolePageAccessPermission(data : Partial<RolePageAccessPermission>[], transaction? : Transaction) : Promise<RolePageAccessPermission[]>
}



export class RoleRepository implements IRoleRepository {
    findOneRole(id: number): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_id : id
            }
        });
    }

    findRoleByOrganization(organizationId: string): Promise<Role[]> {
        return Role.findAll({
            where: {
                organization_id : organizationId
            }
        })
    }

    findRoleByName(name: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_name : {
                    [Op.iLike] : name
                },
            }
        });
    }

    findRoleByIdAndOrganization(id: number, organizationId: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_id : id,
                organization_id : organizationId
            }
        });
    }
    
    findRoleByNameAndOrganization(name: string, organizationId : string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_name : {
                    [Op.iLike] : name
                },
                organization_id : organizationId
            }
        });
    }

    findDefaultRole(): Promise<Role[]> {
        return Role.findAll({
            where: {
                is_default : true,
                role_name: {
                    [Op.ne] : DefaultRoleEnum.SUPER_ADMIN
                }
            }
        })
    }

    findDefaultRoleByName(name: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_name : {
                    [Op.iLike] : name
                },
                is_default : true
            }
        });
    }

    createRole(data: Partial<Role>, transaction?: Transaction): Promise<Role> {
        return Role.create(data, { transaction })
    }

    bulkCreateRolePermissions(data: Partial<RolePermissions>[], transaction? : Transaction): Promise<RolePermissions[]> {
        return RolePermissions.bulkCreate(data, { transaction });
    }

    bulkCreateRolePageAccessPermission(data: Partial<RolePageAccessPermission>[], transaction?: Transaction): Promise<RolePageAccessPermission[]> {
        return RolePageAccessPermission.bulkCreate(data, { transaction });
    }
}