
// exceptions
import { DataNotFound, NotValid } from "../utility/exceptions";

// types and interfaces
import { ILoginData, LoginReturnData } from "../interfaces/IAuth"
import { IAccountRepository } from "../repositories/accountRepository";
import { IHashProvider } from "../providers/hashProvider";
import { IJwtProvider } from "../providers/jwtProvider";
import { IEnvData } from "../interfaces/IConfig";
import { IRolePermissionsRepository } from "../repositories/rolePermissionsRepository";
import { IRolePermissionData } from "../interfaces/IRole";
import { IRefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { Transaction } from "sequelize";
export interface IAuthService {
    login(data : ILoginData, userAgent : string, transaction : Transaction) : Promise<LoginReturnData>;
    generateAccessToken(refreshToken : string, userAgent : string) : Promise<string>
}



export class AuthService implements IAuthService {

    constructor(
        private accountRepository : IAccountRepository,
        private rolePermissionRepository : IRolePermissionsRepository,
        private refreshTokenRepository : IRefreshTokenRepository,
        private hashProvider : IHashProvider,
        private jwtProvider : IJwtProvider,
        private envData : IEnvData,
    ) {}

    async login(data: ILoginData, userAgent : string, transaction : Transaction): Promise<LoginReturnData> {

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

        // get permission data
        const permissions = await this.rolePermissionRepository.findPermissionByRole(account.role_id);
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
            permissions: permissionDataTransformed
        }, this.envData.accessTokenSignature, "10m");

        // create refresh token
        const refreshToken = await this.jwtProvider.generateRefreshToken({
            accountId: account.account_id
        }, this.envData.refreshTokenSignature, "30d");

        // record access token
        const decoded = await this.jwtProvider.validateToken(refreshToken, this.envData.refreshTokenSignature);
        if (!decoded) throw new Error("decode token error");
        const refreshExpDate = new Date(decoded.exp * 1000)
        await this.refreshTokenRepository.recordRefreshToken({
            account_id: account.account_id,
            token_expiry_date: refreshExpDate,
            user_agent : userAgent,
            identifier : refreshToken
        }, transaction);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async generateAccessToken(refreshToken: string, userAgent : string): Promise<string> {

        // check if token valid
        const decoded = await this.jwtProvider.validateToken(refreshToken, this.envData.refreshTokenSignature);
        if (!decoded) throw new NotValid("Refresh token is not valid");

        // get all session
        const session = await this.refreshTokenRepository.findByAccount(decoded.accountId);
        if (session.length === 0) throw new NotValid("Refresh token is not valid");

        // check if token exist inside db
        const refreshTokenSession = session.find(data => data.identifier === refreshToken);
        if (!refreshTokenSession) throw new NotValid("Refresh token is not valid");
        
        // match user agent (make sure token remain in the same device)
        if (refreshTokenSession.user_agent !== userAgent) throw new NotValid("Invalid login detected");

        // check token expiry
        const currentDate = new Date();
        if (refreshTokenSession.token_expiry_date < currentDate) throw new NotValid("Refresh token is not valid");

        // create access token
        const account = await this.accountRepository.findAccountById(decoded.accountId);
        if (!account) throw new Error("something wrong on getting account");

        const permissions = await this.rolePermissionRepository.findPermissionByRole(account.role_id);
        const permissionDataTransformed : IRolePermissionData[] = [];
        permissions.forEach(item => {
            permissionDataTransformed.push({
                permissionId : item.permission_id,
                read : item.read,
                write : item.write
            });
        });

        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: account.organization_id,
            accountId: account.account_id,
            permissions: permissionDataTransformed
        }, this.envData.accessTokenSignature, "10m");

        return accessToken;
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

