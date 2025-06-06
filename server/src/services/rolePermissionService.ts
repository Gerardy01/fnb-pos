
// exceptions
import { ExistData, DataNotFound } from "../utility/exceptions";

// utils
import { DefaultRoleEnum, PermissionEnum } from "../utility/enums";

// models
import RolePermissions from "../models/rolePermission.model";
import RolePageAccessPermission from "../models/rolePageAccessPermission.model";

// types and interfaces
import { Transaction } from "sequelize";
import { ICreateRoleData, RoleWithPermissionReturnData, IRolePermissionData, RoleReturnData, PageAccessPermissionReturnData, PermissionReturnData } from "../interfaces/IRolePermission";
import { IRoleRepository } from "../repositories/roleRepository";
import { IPermissionRepository } from "../repositories/permissionRepository";
import { IPageAccessPermissionRepository, PageAccessPermissionRepository } from "../repositories/pageAccessPermissionRepository";
export interface IRolePermissionService {
    getAllRole(organizationId : string) : Promise<RoleReturnData[]>
    getDefaultRole(userRole : string) : Promise<RoleReturnData[]>
    getOneRole(roleId : number, organizationId : string, userRole : string) : Promise<RoleReturnData>
    getRoleById(roleId : number) : Promise<RoleReturnData>
    getOneRoleWithPermission(roleId : number, organizationId : string, userRole : string) : Promise<RoleWithPermissionReturnData>
    getAllPermission() : Promise<PermissionReturnData[]>;
    getAllPageAccessPermission() : Promise<PageAccessPermissionReturnData[]>
    getDefaultRoleByName(roleName : string) : Promise<RoleReturnData>
    getPermissionByRole(roleId : number) : Promise<IRolePermissionData[]>
    getPageAccessPermissionByRole(roleId : number) : Promise<PageAccessPermissionReturnData[]>
    createRole(data : ICreateRoleData, organizationId : string, transaction? : Transaction) : Promise<RoleWithPermissionReturnData>
}

export class RolePermissionService implements IRolePermissionService {
    constructor(
        private roleRepository : IRoleRepository,
        private permissionRepository : IPermissionRepository,
        private pageAccessPermissionRepository : IPageAccessPermissionRepository,
    ) {}

    async getAllRole(organizationId : string): Promise<RoleReturnData[]> {
        
        const allRole = await this.roleRepository.findRoleByOrganization(organizationId);
        
        if (allRole.length === 0) throw new DataNotFound("No role data");

        const roleList : RoleReturnData[] = [];
        allRole.forEach(item => {
            roleList.push({
                roleId: item.role_id,
                roleName: item.role_name,
                description: item.description,
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
                roleName: item.role_name,
                description: item.description
            });
        });

        return roleList;
    }

    async getOneRole(roleId: number, organizationId: string, userRole: string): Promise<RoleReturnData> {

        const roleData = await this.roleRepository.findOneRole(roleId);
        
        if (!roleData) {
            throw new DataNotFound(`Role with id ${roleId} not found`);
        }

        let roleNotFound : boolean = false;
        if (roleData.organization_id !== organizationId && !roleData.is_default) roleNotFound = true;
        if (roleData.role_name === DefaultRoleEnum.SUPER_ADMIN) roleNotFound = true;

        // check if user not superadmin, prevent to get role
        if (
            roleData.role_name === DefaultRoleEnum.ADMIN &&
            userRole !== DefaultRoleEnum.SUPER_ADMIN
        ) roleNotFound = true;

        if (roleNotFound) throw new DataNotFound(`Role with id ${roleId} not found`);

        return {
            roleId : roleData.role_id,
            roleName : roleData.role_name,
            description : roleData.description,
        }
    }

    // only use to get role with certain condition (ex : get role from account)
    async getRoleById(roleId: number): Promise<RoleReturnData> {

        const role = await this.roleRepository.findOneRole(roleId);
        if (!role) throw new Error("something wrong on getting role detail")

        return {
            roleId : role.role_id,
            roleName : role.role_name,
            description : role.description,
        }
    }

    async getOneRoleWithPermission(roleId: number, organizationId: string, userRole : string): Promise<RoleWithPermissionReturnData> {
        
        const roleData = await this.getOneRole(roleId, organizationId, userRole);

        const permissions = await this.permissionRepository.findPermissionByRole(roleId);

        const permissionData : IRolePermissionData[] = [];
        permissions.forEach(permission => {
            if (!permission.permission) throw new Error("something wrong on permission query");

            permissionData.push({
                permissionId: permission.permission.permission_id,
                permissionName: permission.permission.permission_name,
                read: permission.read,
                write: permission.write
            });
        });

        const pageAccessPermission = await this.pageAccessPermissionRepository.findPageAccessPermissionByRole(roleId);
        const pageAccessPermissionIds : number[] = pageAccessPermission.map(item => item.id);

        return {
            roleId: roleData.roleId,
            roleName: roleData.roleName,
            description: roleData.description,
            permissions: permissionData,
            pageAccessPermissionIds: pageAccessPermissionIds
        }
    }

    async getAllPermission(): Promise<PermissionReturnData[]> {

        let allPermission = await this.permissionRepository.findAllPermission();
        allPermission = allPermission.filter(item => item.permission_id !== PermissionEnum.SUPER_PERMISSION);

        const permissionReturn : PermissionReturnData[] = [];
        allPermission.forEach(item => {
            permissionReturn.push({
                permissionId : item.permission_id,
                permissionName : item.permission_name,
                description : item.description,
            });
        });

        return permissionReturn;
    }

    async getAllPageAccessPermission(): Promise<PageAccessPermissionReturnData[]> {

        const allPageAccessPermission = await this.pageAccessPermissionRepository.findAllPageAccessPermission();
        
        const returnData : PageAccessPermissionReturnData[] = [];
        allPageAccessPermission.forEach(item => {
            returnData.push({
                permissionId : item.id,
                permissionName : item.permission_name,
                description : item.description,
            });
        });

        return returnData;
    }

    async getDefaultRoleByName(roleName: string): Promise<RoleReturnData> {

        const role = await this.roleRepository.findDefaultRoleByName(roleName);
        if (!role) {
            throw new DataNotFound("Role not found");
        }

        return {
            roleId: role.role_id,
            roleName : role.role_name,
            description : role.description,
        }
    }

    async getPermissionByRole(roleId: number): Promise<IRolePermissionData[]> {
        const permissions = await this.permissionRepository.findPermissionByRole(roleId);

        const returnData : IRolePermissionData[] = [];
        permissions.forEach(item => {
            returnData.push({
                permissionId : item.permission_id,
                permissionName : item.permission?.permission_name,
                write : item.write,
                read : item.read,
            });
        });

        return returnData;
    }

    async getPageAccessPermissionByRole(roleId: number): Promise<PageAccessPermissionReturnData[]> {
        const pageAccessPermissions = await this.pageAccessPermissionRepository.findPageAccessPermissionByRole(roleId);

        const returnData : PageAccessPermissionReturnData[] = []
        pageAccessPermissions.forEach(item => {
            if (!item.page_access_permission) throw new Error("something wrong when getting page access permission data");

            returnData.push({
                permissionId : item.permission_id,
                permissionName : item.page_access_permission?.permission_name,
                description : item.page_access_permission?.description
            });
        });

        return returnData;
    }

    async createRole(data: ICreateRoleData, organizationId: string, transaction? : Transaction): Promise<RoleWithPermissionReturnData> {
        
        let permissionIds = data.permissions.map(data => data.permissionId);

        // remove duplicate permission input
        const uniquePermissionIds = new Set(permissionIds);
        permissionIds = Array.from(uniquePermissionIds);

        const uniquePageAccessPermissionIds = new Set(data.pageAccessPermissionIds);
        const pageAccessPermissionIds = Array.from(uniquePageAccessPermissionIds);

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

        if (data.pageAccessPermissionIds.length > 0) {
            const pageAccessPermissions = await this.pageAccessPermissionRepository.findByIds(pageAccessPermissionIds);
            const foundPageAccessPermissionIds = pageAccessPermissions.map(item => item.id);
            if (foundPageAccessPermissionIds.length !== pageAccessPermissionIds.length) {
                const missingPageAccessPermissionIds = pageAccessPermissionIds.filter(id => !foundPageAccessPermissionIds.includes(id));
                throw new DataNotFound(`Page Access Permission with id ${missingPageAccessPermissionIds.join(', ')} does not exist`)
            }
        }

        // create role
        const newRole = await this.roleRepository.createRole({
            role_name: data.roleName,
            organization_id: organizationId,
            description: data.description ? data.description : ""
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
        const newRolePermission = await this.roleRepository.bulkCreateRolePermissions(rolePermissionData, transaction);

        const rolePageAccessPermissionData : Partial<RolePageAccessPermission>[] = [];
        pageAccessPermissionIds.forEach(permissionId => {
            rolePageAccessPermissionData.push({
                role_id: newRole.role_id,
                permission_id : permissionId
            });
        });
        const newRolePageAccessPermission = await this.roleRepository.bulkCreateRolePageAccessPermission(rolePageAccessPermissionData, transaction);
        
        // map return data
        const createdPermissionList : IRolePermissionData[] = [];
        newRolePermission.forEach(item => {
            createdPermissionList.push({
                permissionId: item.permission_id,
                read : item.read,
                write : item.write
            });
        });

        const newRolePageAccessPermissionIds = newRolePageAccessPermission.map(item => item.id); 

        return {
            roleId : newRole.role_id,
            roleName : newRole.role_name,
            description : newRole.description,
            permissions : createdPermissionList,
            pageAccessPermissionIds : newRolePageAccessPermissionIds
        }
    }
}