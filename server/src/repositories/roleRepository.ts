import Role from "../models/role.model"
import { Op } from "sequelize";

// utils
import { DefaultRoleEnum } from "../utility/enums";

// types and interfaces
export interface IRoleRepository {
    findOneRole(id : number) : Promise<Role | null>
    findRoleByname(name : string) : Promise<Role | null>
    roleExistQuery(id : number, organizationId : string) : Promise<Role | null>
}



export class RoleRepository implements IRoleRepository {
    findOneRole(id: number): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_id : id
            }
        });
    }
    findRoleByname(name: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_name : name
            }
        });
    }
    roleExistQuery(id: number, organizationId: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_id : id,
                [Op.not]: {
                    [Op.or]: [
                        { role_name : DefaultRoleEnum.SUPER_ADMIN },
                        {
                            [Op.and] : [
                                { organization_id :{ [Op.not]: null } },
                                { organization_id : organizationId }
                            ]
                        }
                    ]
                }
            }
        });
    }
}