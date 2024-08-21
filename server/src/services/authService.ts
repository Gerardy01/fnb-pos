
// exceptions
import { DataNotFound } from "../utility/exceptions";

// types and interfaces
import { ILoginData, LoginReturnData } from "../interfaces/IAuth"
import { IAccountRepository } from "../repositories/accountRepository";
import { IHashProvider } from "../providers/hashProvider";
import { IJwtProvider } from "../providers/jwtProvider";
export interface IAuthService {
    login(data : ILoginData) : Promise<LoginReturnData>;
}



export class AuthService implements IAuthService {

    constructor(
        private accountRepository : IAccountRepository,
        private hashProvider : IHashProvider,
        private jwtProvider : IJwtProvider,
    ) {}

    async login(data: ILoginData): Promise<LoginReturnData> {

        const account = await this.accountRepository.findAccountByEmailOrUsername(data.identifier);

        if (!account) {
            throw new DataNotFound("Account not found. Make sure you input correct credentials");
        }

        const isMatch = await this.hashProvider.compareHash(data.password, account.password);
        if (!isMatch) throw new DataNotFound("Account not found. Make sure you input correct credentials");

        // get permission
        
        // get signature from .env

        const accessToken = await this.jwtProvider.generateAccessToken({
            username: account.username,
            organizationId: account.organization_id,
            accountId: account.account_id,
            permissions: []
        }, "aaa", "10m");

        const refreshToken = await this.jwtProvider.generateRefreshToken({
            tokenIdentifier: ""
        }, "aaa", "30d")

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }
}

