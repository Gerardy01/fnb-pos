
// exceptions
import { ExistData, DataNotFound } from "../utility/exceptions";

// utils
import { DefaultRoleEnum, PermissionEnum } from "../utility/enums";

// types and interfaces
import { Transaction } from "sequelize";
import { ICreateRoleData, RoleWithPermissionReturnData, IRolePermissionData, RoleReturnData } from "../interfaces/IRole";
import { IRoleRepository } from "../repositories/roleRepository";
import { IPermissionRepository } from "../repositories/permissionRepository";
import { IRolePermissionsRepository } from "../repositories/rolePermissionsRepository";
import RolePermissions from "../models/rolePermission.model";
import { resourceUsage } from "process";
export interface IRoleService {
    getAllRole(organizationId : string) : Promise<RoleReturnData[]>
    getDefaultRole(userRole : string) : Promise<RoleReturnData[]>
    createRole(data : ICreateRoleData, organizationId : string, transaction? : Transaction) : Promise<RoleWithPermissionReturnData>
}

export class RoleService implements IRoleService {
    constructor(
        private roleRepository : IRoleRepository,
        private permissionRepository : IPermissionRepository,
        private rolePermissionRepository : IRolePermissionsRepository,
    ) {}

    async getAllRole(organizationId : string): Promise<RoleReturnData[]> {
        
        const allRole = await this.roleRepository.findRoleByOrganization(organizationId);
        
        if (allRole.length === 0) throw new DataNotFound("No role data");

        const roleList : RoleReturnData[] = [];
        allRole.forEach(item => {
            roleList.push({
                roleId: item.role_id,
                roleName: item.role_name
            });
        });
        
        return roleList
    }

    async getDefaultRole(userRole : string): Promise<RoleReturnData[]> {

        let defaultRoles = await this.roleRepository.findDefaultRole();

        if (userRole !== DefaultRoleEnum.ADMIN && userRole !== DefaultRoleEnum.SUPER_ADMIN) {
            defaultRoles = defaultRoles.filter(item => item.role_name !== DefaultRoleEnum.ADMIN);
        }

        if (defaultRoles.length === 0) throw new DataNotFound("No role data");

        const roleList : RoleReturnData[] = [];
        defaultRoles.forEach(item => {
            roleList.push({
                roleId: item.role_id,
                roleName: item.role_name
            });
        });

        return roleList;
    }

    async createRole(data: ICreateRoleData, organizationId: string, transaction? : Transaction): Promise<RoleWithPermissionReturnData> {
        
        let permissionIds = data.permissions.map(data => data.permissionId);

        // remove duplicate permission input
        const uniquePermissionIds = new Set(permissionIds);
        permissionIds = Array.from(uniquePermissionIds);

        // check if role already exist
        const role = await this.roleRepository.findRoleByNameAndOrganization(data.roleName, organizationId);
        const defaultRole = await this.roleRepository.findDefaultRoleByName(data.roleName);
        if (role || (defaultRole && defaultRole.role_name !== DefaultRoleEnum.SUPER_ADMIN)) {
            throw new ExistData(`Role ${data.roleName} already exist`);
        }

        // check if no super admin permission included in request body data
        const superPermissionInRequest = data.permissions.find(data => data.permissionId === PermissionEnum.SUPER_PERMISSION);
        if (superPermissionInRequest) {
            throw new DataNotFound(`Permission with id ${superPermissionInRequest.permissionId} does not exist`)
        }

        // check if all permission exist
        const permissions = await this.permissionRepository.findByIds(permissionIds);

        const foundPermissionIds = permissions.map(permission => permission.permission_id);
        if (foundPermissionIds.length !== permissionIds.length) {
            const missingPermissionIds = permissionIds.filter(id => !foundPermissionIds.includes(id));
            throw new DataNotFound(`Permission with id ${missingPermissionIds.join(', ')} does not exist`)
        }

        // create role
        const newRole = await this.roleRepository.createRole({
            role_name: data.roleName,
            organization_id: organizationId
        }, transaction);

        const rolePermissionData : Partial<RolePermissions>[] = [];
        data.permissions.forEach(item => {
            rolePermissionData.push({
                role_id : newRole.role_id,
                permission_id : item.permissionId,
                read : item.read,
                write : item.write,
            });
        });

        const newRolePermission = await this.rolePermissionRepository.bulkCreateRolePermissions(rolePermissionData, transaction);
        
        const createdPermissionList : IRolePermissionData[] = [];
        newRolePermission.forEach(item => {
            createdPermissionList.push({
                permissionId: item.permission_id,
                read : item.read,
                write : item.write
            });
        });

        return {
            roleId : newRole.role_id,
            roleName : newRole.role_name,
            permissions : createdPermissionList
        }
    }
}