
// exceptions
import { DataNotFound, NotValid } from "../utility/exceptions";

// utils
import { PermissionEnum } from "../utility/enums";

// types and interfaces
import { IAccessTokenBody, ILoginData, ISuperAdminLoginData, LoginReturnData } from "../interfaces/IAuth"
import { IAccountRepository } from "../repositories/accountRepository";
import { IHashProvider } from "../providers/hashProvider";
import { IJwtProvider } from "../providers/jwtProvider";
import { IEnvData } from "../interfaces/IConfig";
import { IPermissionRepository } from "../repositories/permissionRepository";
import { IRolePermissionData } from "../interfaces/IRole";
import { IRefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { Transaction } from "sequelize";
import { IOrganizationRepository } from "../repositories/organizationRepository";
import { IAdminOrganizationRepository } from "../repositories/adminOrganizationRepository";
import { IAdminOrganizationService } from "./adminOrganizationService";
import { IRoleRepository } from "../repositories/roleRepository";
import { IuaParserProvider } from "../providers/uaParserProvider";
export interface IAuthService {
    login(data : ILoginData, userAgent : string, transaction : Transaction) : Promise<LoginReturnData>;
    superAdminLogin(data : ISuperAdminLoginData, userAgent : string, transaction? : Transaction) : Promise<LoginReturnData>;
    generateAccessToken(refreshToken : string, userAgent : string) : Promise<string>;
    logout(refreshToken : string) : Promise<void>;
    authenticate(accesToken : string) : Promise<IAccessTokenBody>
}



export class AuthService implements IAuthService {

    constructor(
        private accountRepository : IAccountRepository,
        private roleRepoitory : IRoleRepository,
        private permissionRepository : IPermissionRepository,
        private refreshTokenRepository : IRefreshTokenRepository,
        private organizationRepository : IOrganizationRepository,
        private adminOrganizationRepository : IAdminOrganizationRepository,
        private adminOrganizationService : IAdminOrganizationService,
        private hashProvider : IHashProvider,
        private jwtProvider : IJwtProvider,
        private uaParserProvider : IuaParserProvider,
        private envData : IEnvData,
    ) {}

    async login(data: ILoginData, userAgent : string, transaction : Transaction): Promise<LoginReturnData> {

        // find account
        const account = await this.accountRepository.findAccountByEmailOrUsername(data.identifier);

        if (!account) {
            throw new DataNotFound("AUTH001");
        }

        // check password
        const isMatch = await this.hashProvider.compareHash(data.password, account.password);
        if (!isMatch) throw new DataNotFound("Account not found. Make sure you input correct credentials");
        
        // check and revoke sesion if > 3 session detected
        await this.checkAndRevokeSession(account.account_id, 3, transaction);

        // get role data
        const roleData = await this.roleRepoitory.findOneRole(account.role_id);
        if (!roleData) throw new Error("something wrong on getting role detail")

        // get permission data
        const permissions = await this.permissionRepository.findPermissionByRole(account.role_id);
        const permissionDataTransformed : IRolePermissionData[] = [];
        permissions.forEach(item => {
            permissionDataTransformed.push({
                permissionId : item.permission_id,
                read : item.read,
                write : item.write
            });
        });

        // create access token
        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: account.organization_id,
            accountId: account.account_id,
            accountRoleId: roleData.role_id,
            accountRoleName: roleData.role_name,
            permissions: permissionDataTransformed
        }, this.envData.accessTokenSignature, "10m");

        // create refresh token
        const refreshToken = await this.jwtProvider.generateRefreshToken("30d");

        // record refresh token
        const currentTime = new Date();
        const refreshExpDate = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
        const cleanUserAgent =  this.uaParserProvider.getCleanUserAgent(userAgent);
        const hashedUserAgent = await this.hashProvider.hashString(cleanUserAgent);
        await this.refreshTokenRepository.recordRefreshToken({
            account_id: account.account_id,
            token_expiry_date: refreshExpDate,
            user_agent : hashedUserAgent,
            identifier : refreshToken
        }, transaction);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async superAdminLogin(data: ISuperAdminLoginData, userAgent : string, transaction?: Transaction): Promise<LoginReturnData> {
        
        // find account
        const account = await this.accountRepository.findAccountByEmailOrUsername(data.identifier);

        if (!account) {
            throw new DataNotFound("Account not found. Make sure you input correct credentials");
        }

        // check password
        const isMatch = await this.hashProvider.compareHash(data.password, account.password);
        if (!isMatch) throw new DataNotFound("Account not found. Make sure you input correct credentials");
        
        // check and revoke sesion if > 3 session detected
        await this.checkAndRevokeSession(account.account_id, 3, transaction);

        // check if organization exist
        const organization = await this.organizationRepository.findOrganizationByNo(data.organizationNo);
        if (!organization) throw new DataNotFound("Organization not found")

        // get role data
        const roleData = await this.roleRepoitory.findOneRole(account.role_id);
        if (!roleData) throw new Error("something wrong on getting role detail")

        // get permission data
        const permissions = await this.permissionRepository.findPermissionByRole(account.role_id);
        const permissionDataTransformed : IRolePermissionData[] = [];
        permissions.forEach(item => {
            permissionDataTransformed.push({
                permissionId : item.permission_id,
                read : item.read,
                write : item.write
            });
        });

        // check if account is super admin (have super permission)
        const superPermission = permissions.find(item => item.permission_id === PermissionEnum.SUPER_PERMISSION);
        if (!superPermission) throw new DataNotFound("Account not found. Make sure you input correct credentials");

        // create access token
        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: organization.organization_id,
            accountId: account.account_id,
            accountRoleId: roleData.role_id,
            accountRoleName: roleData.role_name,
            permissions: permissionDataTransformed
        }, this.envData.accessTokenSignature, "10m");

        // create refresh token
        const refreshToken = await this.jwtProvider.generateRefreshToken("30d");

        // record access token
        const currentTime = new Date();
        const refreshExpDate = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
        const cleanUserAgent =  this.uaParserProvider.getCleanUserAgent(userAgent);
        const hashedUserAgent = await this.hashProvider.hashString(cleanUserAgent);
        await this.refreshTokenRepository.recordRefreshToken({
            account_id: account.account_id,
            token_expiry_date: refreshExpDate,
            user_agent : hashedUserAgent,
            identifier : refreshToken
        }, transaction);

        // update user organization
        await this.adminOrganizationService.updateOrCreateAdminOrganization(account.account_id, organization.organization_id)

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async generateAccessToken(refreshToken: string, userAgent : string): Promise<string> {

        // check if token exist inside db
        const refreshTokenSession = await this.refreshTokenRepository.findByIdentifier(refreshToken);
        if (!refreshTokenSession || (refreshTokenSession && refreshTokenSession.is_revoked)) throw new NotValid("Refresh token is not valid");
        
        // match user agent (make sure token remain in the same device)
        const cleanUserAgent = this.uaParserProvider.getCleanUserAgent(userAgent);
        const isMatch = this.hashProvider.compareHash(refreshTokenSession.user_agent, cleanUserAgent);
        if (!isMatch) throw new NotValid("Invalid login detected");

        // check token expiry
        const currentDate = new Date();
        if (refreshTokenSession.token_expiry_date < currentDate) throw new NotValid("Refresh token is not valid");

        // create access token
        const account = await this.accountRepository.findAccountById(refreshTokenSession.account_id);
        if (!account) throw new Error("something wrong on getting account");

        // get role data
        const roleData = await this.roleRepoitory.findOneRole(account.role_id);
        if (!roleData) throw new Error("something wrong on getting role detail")

        const permissions = await this.permissionRepository.findPermissionByRole(account.role_id);
        const permissionDataTransformed : IRolePermissionData[] = [];
        permissions.forEach(item => {
            permissionDataTransformed.push({
                permissionId : item.permission_id,
                read : item.read,
                write : item.write
            });
        });

        let organizationId = account.organization_id;

        // check if user superadmin
        const superPermission = permissions.find(item => item.permission_id === PermissionEnum.SUPER_PERMISSION);
        if (superPermission) {
            const adminOrganization = await this.adminOrganizationRepository.findByAccountId(account.account_id);
            if (!adminOrganization) throw new Error("something wrong on getting admin organization");
            organizationId = adminOrganization.organization_id;
        }

        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: organizationId,
            accountId: account.account_id,
            accountRoleId: roleData.role_id,
            accountRoleName: roleData.role_name,
            permissions: permissionDataTransformed
        }, this.envData.accessTokenSignature, "10m");

        return accessToken;
    }

    async logout(refreshToken: string): Promise<void> {
        
        const session = await this.refreshTokenRepository.findByIdentifier(refreshToken);
        if (!session) return;

        session.is_revoked = true;
        session.save();
    }

    async authenticate(accesToken: string): Promise<IAccessTokenBody> {
        
        const decoded = await this.jwtProvider.validateToken(accesToken, this.envData.accessTokenSignature);
        
        if (!decoded) throw new NotValid("Access token is not valid");

        const currentDate = new Date();
        const accessExpDate = new Date(decoded.exp * 1000);

        if (accessExpDate < currentDate) {
            throw new NotValid("Access token is not valid");
        }

        return {
            username: decoded.username,
            organizationId : decoded.organizationId,
            accountId : decoded.accountId,
            accountRoleId : decoded.accountRoleId,
            accountRoleName : decoded.accountRoleName,
            permissions : decoded.permissions
        }
    }

    private async checkAndRevokeSession(accountId : string, cap : number = 3, transaction? : Transaction) : Promise<void> {

        const currentDate = new Date();

        const sessionList = await this.refreshTokenRepository.findByAccount(accountId);
        const filtered = sessionList.filter(data => !data.is_revoked && data.token_expiry_date > currentDate);

        if (filtered.length < cap) return;

        filtered[0].is_revoked = true
        filtered[0].save({ transaction });
    }
}

