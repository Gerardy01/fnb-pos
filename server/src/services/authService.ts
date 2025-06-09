
// exceptions
import { DataNotFound, NotValid, WrongFormat } from "../utility/exceptions";

// utils
import { DefaultRoleEnum, PermissionEnum, SendEmailTypeEnum } from "../utility/enums";
import { validateEmail, generateCode, renderTemplate } from "../utility/utils";

// queue
import { sendEmailToQueue } from "../queue/emailProducer";

// types and interfaces
import { IAccessTokenBody, IGenerateOtpData, ILoginData, ISuperAdminLoginData, LoginReturnData } from "../interfaces/IAuth"
import { IHashProvider } from "../providers/hashProvider";
import { IJwtProvider } from "../providers/jwtProvider";
import { IEnvData } from "../interfaces/IConfig";
import { IRolePermissionData } from "../interfaces/IRolePermission";
import { IRefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { Transaction } from "sequelize";
import { IuaParserProvider } from "../providers/uaParserProvider";
import { IOrganizationService } from "./organizationService";
import { IRolePermissionService } from "./rolePermissionService";
import { IAccountService } from "./accountService";
import { IOtpAuthRepository } from "../repositories/otpAuthRepository";
export interface IAuthService {
    login(data : ILoginData, userAgent : string, transaction : Transaction) : Promise<LoginReturnData>;
    superAdminLogin(data : ISuperAdminLoginData, userAgent : string, transaction? : Transaction) : Promise<LoginReturnData>;
    generateAccessToken(refreshToken : string, userAgent : string) : Promise<string>;
    logout(refreshToken : string) : Promise<void>;
    logoutAllSession(accountId : string) : Promise<boolean>;
    generateOtpCode(data : IGenerateOtpData, transaction? : Transaction) : Promise<void>;
    authenticate(accesToken : string) : Promise<IAccessTokenBody>;
}



export class AuthService implements IAuthService {

    constructor(
        private organizationService : IOrganizationService,
        private rolePermissionService : IRolePermissionService,
        private accountService : IAccountService,
        private refreshTokenRepository : IRefreshTokenRepository,
        private otpAuthRepository : IOtpAuthRepository,
        private hashProvider : IHashProvider,
        private jwtProvider : IJwtProvider,
        private uaParserProvider : IuaParserProvider,
        private envData : IEnvData,
    ) {}

    async login(data: ILoginData, userAgent : string, transaction : Transaction): Promise<LoginReturnData> {

        // find account
        const account = await this.accountService.getAccountForLogin(data.identifier);

        // check password
        const isMatch = await this.hashProvider.compareHash(data.password, account.password);
        if (!isMatch) throw new DataNotFound("AUTH001");

        const organization = await this.organizationService.getOrganization(account.organizationId);

        // check if organization still valid
        const currentDate = new Date();
        if (organization.endValidDatetime < currentDate) {
            throw new NotValid("Organization is no longer valid (expired)");
        }
        
        // check and revoke sesion if > 3 session detected
        await this.checkAndRevokeSession(account.accountId, 3, transaction);

        // get role data
        const roleData = await this.rolePermissionService.getRoleById(account.roleId);

        // get permission data
        const permissions = await this.rolePermissionService.getPermissionByRole(account.roleId);
        const permissionDataTransformed : IRolePermissionData[] = [];
        permissions.forEach(item => {
            permissionDataTransformed.push({
                permissionId : item.permissionId,
                read : item.read,
                write : item.write
            });
        });

        // create access token
        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: account.organizationId,
            organizationExpiryDate: organization.endValidDatetime,
            accountId: account.accountId,
            accountRoleId: roleData.roleId,
            accountRoleName: roleData.roleName,
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
            account_id: account.accountId,
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
        const account = await this.accountService.getAccountForLogin(data.identifier);

        // check password
        const isMatch = await this.hashProvider.compareHash(data.password, account.password);
        if (!isMatch) throw new DataNotFound("AUTH001");
        
        // check and revoke sesion if > 3 session detected
        await this.checkAndRevokeSession(account.accountId, 3, transaction);

        // get organization
        const organization = await this.organizationService.getOrganizationByNo(data.organizationNo);

        // get role data
        const roleData = await this.rolePermissionService.getRoleById(account.roleId);

        // get permission data
        const permissions = await this.rolePermissionService.getPermissionByRole(account.roleId);
        const permissionDataTransformed : IRolePermissionData[] = [];
        permissions.forEach(item => {
            permissionDataTransformed.push({
                permissionId : item.permissionId,
                read : item.read,
                write : item.write
            });
        });

        // check if account is super admin (have super permission)
        const superPermission = permissions.find(item => item.permissionId === PermissionEnum.SUPER_PERMISSION);
        if (!superPermission) throw new DataNotFound("Account not found. Make sure you input correct credentials");

        // create access token
        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: organization.organizationId,
            organizationExpiryDate: organization.endValidDatetime,
            accountId: account.accountId,
            accountRoleId: roleData.roleId,
            accountRoleName: roleData.roleName,
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
            account_id: account.accountId,
            token_expiry_date: refreshExpDate,
            user_agent : hashedUserAgent,
            identifier : refreshToken
        }, transaction);

        // update user organization
        await this.organizationService.updateOrCreateAdminOrganization(account.accountId, organization.organizationId)

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

        const account = await this.accountService.getAccountById(refreshTokenSession.account_id);

        const organization = await this.organizationService.getOrganization(account.organizationId);

        // get role data
        const roleData = await this.rolePermissionService.getRoleById(account.roleId);

        // check if organization still valid
        if (organization.endValidDatetime < currentDate && roleData.roleName !== DefaultRoleEnum.SUPER_ADMIN) {
            throw new NotValid("Organization is no longer valid (expired)");
        }
        
        const permissions = await this.rolePermissionService.getPermissionByRole(roleData.roleId);
        const permissionDataTransformed : IRolePermissionData[] = [];
        permissions.forEach(item => {
            permissionDataTransformed.push({
                permissionId : item.permissionId,
                read : item.read,
                write : item.write
            });
        });

        let organizationId = account.organizationId;

        // check if user superadmin
        const superPermission = permissions.find(item => item.permissionId === PermissionEnum.SUPER_PERMISSION);
        if (superPermission) {
            const adminOrganization = await this.organizationService.getAdminOrganizationByAccount(account.accountId);
            organizationId = adminOrganization.organizationId;
        }

        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: organizationId,
            organizationExpiryDate: organization.endValidDatetime,
            accountId: account.accountId,
            accountRoleId: roleData.roleId,
            accountRoleName: roleData.roleName,
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

    async logoutAllSession(accountId: string): Promise<boolean> {

        const [affectedCount] = await this.refreshTokenRepository.revokeAllByAccount(accountId);
        if (affectedCount === 0) return false;
        return true;
        
    }

    async authenticate(accesToken: string): Promise<IAccessTokenBody> {
        
        const decoded = await this.jwtProvider.validateToken(accesToken, this.envData.accessTokenSignature);
        
        if (!decoded) throw new NotValid("Access token is not valid");

        const currentDate = new Date();
        const accessExpDate = new Date(decoded.exp * 1000);

        if (accessExpDate < currentDate) {
            throw new NotValid("Access token is not valid");
        }
        
        // add ons validation
        const organizationExpired = new Date(decoded.organizationExpiryDate)
        if (organizationExpired < currentDate && decoded.accountRoleName !== DefaultRoleEnum.SUPER_ADMIN) {
            throw new NotValid("Access token is not valid");
        }

        return {
            username: decoded.username,
            organizationId : decoded.organizationId,
            organizationExpiryDate: decoded.organizationExpiryDate,
            accountId : decoded.accountId,
            accountRoleId : decoded.accountRoleId,
            accountRoleName : decoded.accountRoleName,
            permissions : decoded.permissions
        }
    }

    async generateOtpCode(data: IGenerateOtpData, transaction? : Transaction): Promise<void> {
        const { valid : validEmail, message : emailNotValidMessage } = validateEmail(data.address);
        if (!validEmail) {
            throw new WrongFormat(emailNotValidMessage);
        }

        // revoke address's any active otp
        await this.otpAuthRepository.revokeActiveOtpByAddress(data.address);
        
        const currentTime = new Date();

        // generate and check if code is occupied
        let otpCode = 0;
        while(otpCode == 0) {
            const newOtp : number = generateCode();
            
            const activeOtpCode = await this.otpAuthRepository.findActiveOtpsByCode(newOtp, transaction);
            if (activeOtpCode && activeOtpCode.expires_at >= currentTime) continue;

            otpCode = newOtp;
            break;
        }

        // generate otp
        const expiredSec = data.expired_second ? data.expired_second : Number(this.envData.otpDefaultExpirySec);
        const expiredDate = new Date(currentTime.getTime() + expiredSec * 1000);

        const otpAuth = await this.otpAuthRepository.createOtpAuth({
            code : otpCode,
            send_to : data.address,
            expires_at : expiredDate,
        }, transaction);

        this.sendOtpEmail(data.address, otpAuth.code);
    }

    private async checkAndRevokeSession(accountId : string, cap : number = 3, transaction? : Transaction) : Promise<void> {

        const currentDate = new Date();

        const sessionList = await this.refreshTokenRepository.findByAccount(accountId);
        const filtered = sessionList.filter(data => !data.is_revoked && data.token_expiry_date > currentDate);

        if (filtered.length < cap) return;

        filtered[0].is_revoked = true
        filtered[0].save({ transaction });
    }

    private async sendOtpEmail(to : string, otp : number) : Promise<void> {
        const html = await renderTemplate("otp.html", { otp : otp })
        sendEmailToQueue({
            to: to,
            subject: 'Your OTP',
            body : html,
            type : SendEmailTypeEnum.HTML
        });
    }
}

