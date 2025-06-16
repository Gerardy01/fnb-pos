// services
import { OrganizationService } from "./organizationService";
import { CounterService } from "./counterService";
import { OrganizationAccountSerivice } from "./organizationAccountService";
import { AccountService } from "./accountService";
import { AuthService } from "./authService";
import { RolePermissionService } from "./rolePermissionService";
import { NotificationService } from "./notificationService";
import { OutletService } from "./outletService";

// repository
import { OrganizationRepository } from "../repositories/organizationRepository";
import { CounterRepository } from "../repositories/counterRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { PermissionRepository } from "../repositories/permissionRepository";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { AdminOrganizationRepository } from "../repositories/adminOrganizationRepository";
import { PageAccessPermissionRepository } from "../repositories/pageAccessPermissionRepository";
import { OtpAuthRepository } from "../repositories/otpAuthRepository";
import { TokenAuthRepository } from "../repositories/tokenAuthRepository";
import { OutletRepository } from "../repositories/outletRepository";
import { AccountOutletRepository } from "../repositories/accountOutletRepository";

// providers
import { BcryptJsHashProvider } from "../providers/hashProvider";
import { JsonWebTokenJwtProvider } from "../providers/jwtProvider";
import { UAParserJsUaParserProvider } from "../providers/uaParserProvider";
import { NodemailerEmailProvider } from "../providers/emailProvider";

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
const otpAuthRepository = new OtpAuthRepository();
const tokenAuthRepository = new TokenAuthRepository();
const outletRepository = new OutletRepository();
const accountOutletRepository = new AccountOutletRepository();

const bcryptJsHashProvider = new BcryptJsHashProvider();
const jsonWebTokenJwtProvider = new JsonWebTokenJwtProvider();
const uaParserJsUaParserProvider = new UAParserJsUaParserProvider();
const emailProvider = new NodemailerEmailProvider(envData);

// unexposed service
const counterService = new CounterService(counterRepository);


// main service
export const organizationService = new OrganizationService(counterService, organizationRepository, adminOrganizationRepository);
export const rolePermissionService = new RolePermissionService(roleRepository, permissionRepository, pageAccessPermissionRepository, accountRepository);
export const accountService = new AccountService(
    rolePermissionService,
    accountRepository,
    otpAuthRepository,
    tokenAuthRepository,
    outletRepository,
    accountOutletRepository,
    bcryptJsHashProvider
);
export const authService = new AuthService(
    organizationService,
    rolePermissionService,
    accountService,
    refreshTokenRepository,
    otpAuthRepository,
    accountRepository,
    tokenAuthRepository,
    bcryptJsHashProvider,
    jsonWebTokenJwtProvider,
    uaParserJsUaParserProvider,
    envData
);
export const notificationService = new NotificationService(emailProvider);
export const outletService = new OutletService(outletRepository, accountRepository, accountOutletRepository);


// combined service (orchestration)
export const organizationAccountService = new OrganizationAccountSerivice(organizationService, accountService, organizationRepository);