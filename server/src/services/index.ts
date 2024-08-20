// services
import { OrganizationService } from "./organizationService";
import { CounterService } from "./counterService";
import { OrganizationAccountSerivice } from "./organizationAccountService";
import { AccountService } from "./accountService";
import { AuthService } from "./authService";
import { RoleService } from "./roleService";

// repository
import { OrganizationRepository } from "../repositories/organizationRepository";
import { CounterRepository } from "../repositories/counterRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { PermissionRepository } from "../repositories/permissionRepository";
import { RolePermissionsRepository } from "../repositories/rolePermissionsRepository";

// providers
import { BcryptHashProvider } from "../providers/hashProvider";


const organizationRepository = new OrganizationRepository();
const counterRepository = new CounterRepository();
const accountRepository = new AccountRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const rolePermissionRepository = new RolePermissionsRepository();

const bcryptHashProvider = new BcryptHashProvider();

// unexposed service
const counterService = new CounterService(counterRepository);


// main service
export const organizationService = new OrganizationService(organizationRepository, counterService);
export const accountService = new AccountService(accountRepository, roleRepository, bcryptHashProvider);
export const authService = new AuthService();
export const roleService = new RoleService(roleRepository, permissionRepository, rolePermissionRepository);


// combined service
export const organizationAccountService = new OrganizationAccountSerivice(organizationService, accountService, organizationRepository);