import { AuthApi } from "./authApi";
import { AccountApi } from "./accountApi";
import { OrganizationApi } from "./organizationApi";
import { RoleApi } from "./roleApi";
import { PermissionApi } from "./permissionApi";
import { OutletApi } from "./outletApi";
import { TableApi } from "./tableApi";



export const authApi = new AuthApi();
export const accountApi = new AccountApi();
export const organizationApi = new OrganizationApi();
export const roleApi = new RoleApi();
export const permissionApi = new PermissionApi();
export const outletApi = new OutletApi();
export const tableApi = new TableApi();