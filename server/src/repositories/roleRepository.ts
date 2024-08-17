import Role from "../models/role.model"

// types and interfaces
export interface IRoleRepository {
    findOneRole(id : number) : Promise<Role | null>
    findRoleByname(name : string) : Promise<Role | null>
    findDefaultRoleByName(name : string) : Promise<Role | null>
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

    findDefaultRoleByName(name: string): Promise<Role | null> {
        return Role.findOne({
            where: {
                role_name : name,
                is_default : true
            }
        });
    }
}