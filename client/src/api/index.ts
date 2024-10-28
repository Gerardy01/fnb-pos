import { AuthApi } from "./authApi";
import { AccountApi } from "./accountApi";
import { OrganizationApi } from "./organizationApi";



export const authApi = new AuthApi();
export const accountApi = new AccountApi();
export const organizationApi = new OrganizationApi();