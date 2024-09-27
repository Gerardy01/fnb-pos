import { PageAccessPermission, RolePageAccessPermission } from "../models";

// types and interfaces
export interface IPageAccessPermissionRepository {
    findAllPageAccessPermission() : Promise<PageAccessPermission[]>
    findByIds(pageAccessPermissionIds : number[]) : Promise<PageAccessPermission[]>
    findPageAccessPermissionByRole(roleId : number) : Promise<RolePageAccessPermission[]>
}



export class PageAccessPermissionRepository implements IPageAccessPermissionRepository {
    findAllPageAccessPermission(): Promise<PageAccessPermission[]> {
        return PageAccessPermission.findAll();
    }

    findByIds(pageAccessPermissionIds: number[]): Promise<PageAccessPermission[]> {
        return PageAccessPermission.findAll({
            where: {
                id : pageAccessPermissionIds
            }
        });
    }

    findPageAccessPermissionByRole(roleId: number): Promise<RolePageAccessPermission[]> {
        return RolePageAccessPermission.findAll({
            where: {
                role_id : roleId
            },
            include: [{
                model: PageAccessPermission,
                as: 'page_access_permission'
            }]
        });
    }
}