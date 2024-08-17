
// utils
import { DefaultRoleEnum } from "../utility/enums";
import { validatePassword, validateUsername } from "../utility/utils";

// exceptions
import { ExistData, DataNotFound, WrongFormat } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import { AccountDataReturn, ICreateAccountData, ICreateAccountForManagementData } from "../interfaces/IAccount";
import { IAccountRepository } from "../repositories/accountRepository";
import { IRoleRepository } from "../repositories/roleRepository";
import { IHashProvider } from "../providers/hashProvider";
import { IOrganizationRepository } from "../repositories/organizationRepository";
export interface IAccountService {
    createAccount(data : ICreateAccountData, organizationId : string, transaction? : Transaction) : Promise<AccountDataReturn>
    createAccountForManagement(data : ICreateAccountForManagementData, transaction? : Transaction, forSuperAdmin? : boolean) : Promise<AccountDataReturn>
}



export class AccountService implements IAccountService {
    constructor(
        private accountRepository : IAccountRepository,
        private roleRepository : IRoleRepository,
        private hashProvider : IHashProvider,
    ) {}

    async createAccount(data: ICreateAccountData, organizationId : string, transaction?: Transaction): Promise<AccountDataReturn> {

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
            console.log(usernameValid)
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