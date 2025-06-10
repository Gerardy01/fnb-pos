import { Op } from "sequelize";
import {
    Role,
    RolePermissions,
    RolePageAccessPermission,
} from "../models";

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
    destroyRolePermission(roleId : number, transaction? : Transaction) : Promise<void>
    destroyRolePageAccessPermission(roleId : number, transaction? : Transaction) : Promise<void>
}



export class RoleRepository implements IRoleRepository {
    findOneRole(id: number): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_id : id,
                archived : false,
            }
        });
    }

    findRoleByOrganization(organizationId: string): Promise<Role[]> {
        return Role.findAll({
            where: {
                organization_id : organizationId,
                archived : false,
            }
        })
    }

    findRoleByName(name: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_name : {
                    [Op.iLike] : name
                },
                archived : false,
            }
        });
    }

    findRoleByIdAndOrganization(id: number, organizationId: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_id : id,
                organization_id : organizationId,
                archived : false,
            }
        });
    }
    
    findRoleByNameAndOrganization(name: string, organizationId : string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_name : {
                    [Op.iLike] : name
                },
                organization_id : organizationId,
                archived : false,
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

    async destroyRolePermission(roleId: number, transaction? : Transaction): Promise<void> {
        RolePermissions.destroy({
            where: {
                role_id : roleId
            },
            transaction
        });
    }

    async destroyRolePageAccessPermission(roleId : number, transaction? : Transaction): Promise<void> {
        RolePageAccessPermission.destroy({
            where: {
                role_id : roleId
            },
            transaction
        });
    }
}