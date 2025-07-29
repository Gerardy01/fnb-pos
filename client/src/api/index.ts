import { AuthApi } from "./authApi";
import { AccountApi } from "./accountApi";
import { OrganizationApi } from "./organizationApi";
import { RoleApi } from "./roleApi";
import { PermissionApi } from "./permissionApi";
import { OutletApi } from "./outletApi";
import { TableApi } from "./tableApi";
import { GratuityApi } from "./gratuityApi";
import { SalesTypeApi } from "./salesTypeApi";
import { TaxApi } from "./taxApi";
import { CategoryApi } from "./categoryApi";
import { ModifierApi } from "./modifierApi";



export const authApi = new AuthApi();
export const accountApi = new AccountApi();
export const organizationApi = new OrganizationApi();
export const roleApi = new RoleApi();
export const permissionApi = new PermissionApi();
export const outletApi = new OutletApi();
export const tableApi = new TableApi();
export const gratuityApi = new GratuityApi();
export const salesTypeApi = new SalesTypeApi();
export const taxApi = new TaxApi();
export const categoryApi = new CategoryApi();
export const modifierApi = new ModifierApi();