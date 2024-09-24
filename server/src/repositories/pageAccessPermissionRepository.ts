import PageAccessPermission from "../models/pageAccessPermission.models";

// types and interfaces
export interface IPageAccessPermissionRepository {
    findAllPageAccessPermission() : Promise<PageAccessPermission[]>
    findByIds(pageAccessPermissionIds : number[]) : Promise<PageAccessPermission[]>
    findPageAccessPermissionByRole(roleId : number) : Promise<PageAccessPermission[]>
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

    findPageAccessPermissionByRole(roleId: number): Promise<PageAccessPermission[]> {
        return PageAccessPermission.findAll({
            where: {
                role_id : roleId
            }
        });
    }
}