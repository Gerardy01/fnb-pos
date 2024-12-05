// services
import { OrganizationService } from "./organizationService";
import { CounterService } from "./counterService";
import { OrganizationAccountSerivice } from "./organizationAccountService";
import { AccountService } from "./accountService";
import { AuthService } from "./authService";
import { RolePermissionService } from "./rolePermissionService";

// repository
import { OrganizationRepository } from "../repositories/organizationRepository";
import { CounterRepository } from "../repositories/counterRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { PermissionRepository } from "../repositories/permissionRepository";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { AdminOrganizationRepository } from "../repositories/adminOrganizationRepository";
import { PageAccessPermissionRepository } from "../repositories/pageAccessPermissionRepository";

// providers
import { BcryptHashProvider } from "../providers/hashProvider";
import { JsonWebTokenJwtProvider } from "../providers/jwtProvider";
import { UAParserJsUaParserProvider } from "../providers/uaParserProvider";

// config
import envData from "../config/envData";


const organizationRepository = new OrganizationRepository();
const counterRepository = new CounterRepository();
const accountRepository = new AccountRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const adminOrganizationRepository = new AdminOrganizationRepository();
const pageAccessPermissionRepository = new PageAccessPermissionRepository();

const bcryptHashProvider = new BcryptHashProvider();
const jsonWebTokenJwtProvider = new JsonWebTokenJwtProvider();
const uaParserJsUaParserProvider = new UAParserJsUaParserProvider(); 

// unexposed service
const counterService = new CounterService(counterRepository);


// main service
export const organizationService = new OrganizationService(counterService, organizationRepository, adminOrganizationRepository);
export const rolePermissionService = new RolePermissionService(roleRepository, permissionRepository, pageAccessPermissionRepository);
export const accountService = new AccountService(rolePermissionService, accountRepository, bcryptHashProvider);
export const authService = new AuthService(
    organizationService,
    rolePermissionService,
    accountService,
    refreshTokenRepository,
    bcryptHashProvider,
    jsonWebTokenJwtProvider,
    uaParserJsUaParserProvider,
    envData
);


// combined service (orchestration)
export const organizationAccountService = new OrganizationAccountSerivice(organizationService, accountService, organizationRepository);