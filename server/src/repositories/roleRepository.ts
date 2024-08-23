import { Op } from "sequelize"
import Role from "../models/role.model"

// types and interfaces
import { Transaction } from "sequelize"
export interface IRoleRepository {
    findOneRole(id : number) : Promise<Role | null>
    findRoleByName(name : string) : Promise<Role | null>
    findRoleByIdAndOrganization(id : number, organizationId : string) : Promise<Role | null>
    findRoleByNameAndOrganization(name : string, organizationId : string) : Promise<Role | null>
    findDefaultRoleByName(name : string) : Promise<Role | null>
    createRole(data : Partial<Role>, transaction? : Transaction) : Promise<Role>
}



export class RoleRepository implements IRoleRepository {
    findOneRole(id: number): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_id : id
            }
        });
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
}