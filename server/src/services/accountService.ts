
// utils
import { DefaultRoleEnum } from "../utility/enums";
import { validatePassword, validateUsername } from "../utility/utils";

// exceptions
import { ExistData, DataNotFound, WrongFormat } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import { AccountDataReturn, ICreateAccountData, ICreateAccountForManagementData, AccountInfoReturn } from "../interfaces/IAccount";
import { IAccountRepository } from "../repositories/accountRepository";
import { IRoleRepository } from "../repositories/roleRepository";
import { IHashProvider } from "../providers/hashProvider";
import { IPageAccessPermissionRepository } from "../repositories/pageAccessPermissionRepository";
export interface IAccountService {
    getUserAccount(accountId : string) : Promise<AccountInfoReturn>
    createAccount(data : ICreateAccountData, organizationId : string, userRole : string, transaction? : Transaction) : Promise<AccountDataReturn>
    createAccountForManagement(data : ICreateAccountForManagementData, transaction? : Transaction, forSuperAdmin? : boolean) : Promise<AccountDataReturn>
}



export class AccountService implements IAccountService {
    constructor(
        private accountRepository : IAccountRepository,
        private roleRepository : IRoleRepository,
        private pageAccessPermissionRepository : IPageAccessPermissionRepository,
        private hashProvider : IHashProvider,
    ) {}

    async getUserAccount(accountId: string): Promise<AccountInfoReturn> {

        // get account
        const account = await this.accountRepository.findAccountWithRole(accountId);
        if (!account) throw new DataNotFound("ACCOUNT404");
        if (!account.role) throw Error("Error in getting role from this account");

        // get page access permission
        const pageAccessPermissions = await this.pageAccessPermissionRepository.findPageAccessPermissionByRole(account.role.role_id);
        const pageAccessPermissionIds = pageAccessPermissions.map(item => item.id);
        
        return {
            accountId: account.account_id,
            username: account.username,
            name: account.name,
            email: account.email,
            roleId: account.role.role_id,
            roleName: account.role.role_name,
            pageAccessPermissions: pageAccessPermissionIds
        }
    }

    async createAccount(data: ICreateAccountData, organizationId : string, userRole : string, transaction?: Transaction): Promise<AccountDataReturn> {

        // check if username format is valid
        const usernameValid = validateUsername(data.username);
        if (!usernameValid.valid) {
            throw new WrongFormat(usernameValid.message);
        }

        // check if password format is valid
        const passwordValid = validatePassword(data.password);
        if (!passwordValid.valid) {
            throw new WrongFormat(passwordValid.message);
        }

        // check duplicate username
        const existUsername = await this.accountRepository.findAccountByUsername(data.username);
        if (existUsername) {
            throw new ExistData("Username already exist");
        }

        // check duplicate email
        const inputedEmail = data.email ? data.email : "";
        const existEmail = await this.accountRepository.findAccountByEmail(inputedEmail);
        if (inputedEmail !== "" && existEmail) {
            throw new ExistData("Email already exist");
        }

        // check if role exist
        let isNotFound = false;
        const role = await this.roleRepository.findOneRole(data.roleId);
        if (!role) isNotFound = true;
        if (role && role.is_default && role.role_name == DefaultRoleEnum.SUPER_ADMIN) isNotFound = true;
        if (role && !role.is_default && role.organization_id !== organizationId) isNotFound = true;
        if (isNotFound) {
            throw new DataNotFound("Role not found");
        }

        // check if not admin, prevent create admin account
        if (userRole !== DefaultRoleEnum.ADMIN && role?.role_name == DefaultRoleEnum.ADMIN) {
            throw new DataNotFound("Role not found");
        }

        const hashedPassword = await this.hashProvider.hashString(data.password);

        const account = await this.accountRepository.createAccount({
            username : data.username,
            name : data.name,
            email : inputedEmail,
            password : hashedPassword,
            organization_id : organizationId,
            role_id: role?.role_id,
        }, transaction);

        return {
            accountId : account.account_id,
            username : account.username,
            name : account.name,
            email : account.email,
            organizationId : account.organization_id,
            roleId : account.role_id,
            roleName : role ? role.role_name : "",
            archived : account.archived,
        }
    }

    async createAccountForManagement(data: ICreateAccountForManagementData, transaction?: Transaction, forSuperAdmin : boolean = false): Promise<AccountDataReturn> {
        
        // check if username format is valid
        const usernameValid = validateUsername(data.username);
        if (!usernameValid.valid) {
            throw new WrongFormat(usernameValid.message);
        }

        // check if password format is valid
        const passwordValid = validatePassword(data.password);
        if (!passwordValid.valid) {
            throw new WrongFormat(passwordValid.message);
        }
        
        // check duplicate username
        const existUsername = await this.accountRepository.findAccountByUsername(data.username);
        if (existUsername) {
            throw new ExistData("Username already exist");
        }

        // check duplicate email
        const inputedEmail = data.email ? data.email : "";
        const existEmail = await this.accountRepository.findAccountByEmail(inputedEmail);
        if (inputedEmail !== "" && existEmail) {
            throw new ExistData("Email already exist");
        }

        const role = await this.roleRepository.findDefaultRoleByName(forSuperAdmin ? DefaultRoleEnum.SUPER_ADMIN : DefaultRoleEnum.ADMIN);
        if (!role) {
            throw new DataNotFound("Role not found");
        }

        const hashedPassword = await this.hashProvider.hashString(data.password);

        const account = await this.accountRepository.createAccount({
            username : data.username,
            name : data.name,
            email : inputedEmail,
            password : hashedPassword,
            organization_id : data.organizationId,
            role_id: role.role_id,
        }, transaction);

        return {
            accountId : account.account_id,
            username : account.username,
            name : account.name,
            email : account.email,
            organizationId : account.organization_id,
            roleId : account.role_id,
            roleName : role.role_name,
            archived : account.archived,
        }
    }
}