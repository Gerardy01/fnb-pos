import { AuthApi } from "./authApi";
import { AccountApi } from "./accountApi";
import { OrganizationApi } from "./organizationApi";
import { RoleApi } from "./roleApi";



export const authApi = new AuthApi();
export const accountApi = new AccountApi();
export const organizationApi = new OrganizationApi();
export const roleApi = new RoleApi();