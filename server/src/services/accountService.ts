
// models
import { Account } from "../models";

// utils
import { DefaultRoleEnum, EditAccountProcessEnum } from "../utility/enums";
import { validatePassword, validateUsername } from "../utility/utils";

// exceptions
import { ExistData, DataNotFound, WrongFormat, NotValid, Forbidden } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import {
    AccountDataReturn,
    ICreateAccountData,
    ICreateAccountForManagementData,
    AccountInfoReturn,
    IChangePassword,
    IResetPassword,
    IChangeUsername,
    IChangeEmail,
    IChangeName,
    IEditAccount,
    EditAccountReturn
} from "../interfaces/IAccount";
import { IAccountRepository } from "../repositories/accountRepository";
import { IRoleRepository } from "../repositories/roleRepository";
import { IHashProvider } from "../providers/hashProvider";
import { IPageAccessPermissionRepository } from "../repositories/pageAccessPermissionRepository";
export interface IAccountService {
    getUserAccount(accountId : string) : Promise<AccountInfoReturn>
    createAccount(data : ICreateAccountData, organizationId : string, userRole : string, transaction? : Transaction) : Promise<AccountDataReturn>
    createAccountForManagement(data : ICreateAccountForManagementData, transaction? : Transaction, forSuperAdmin? : boolean) : Promise<AccountDataReturn>
    checkUsernameAvailable(username : string) : Promise<boolean>
    checkEmailAvailable(email : string) : Promise<boolean>
    editAccount(data : IEditAccount, userAccountId : string, userRole : string) : Promise<EditAccountReturn>
    changeUsername(data : IChangeUsername, userAccountId : string, userRole : string) : Promise<string>
    changeEmail(data : IChangeEmail, userAccountId : string, userRole : string) : Promise<string>
    changeName(data : IChangeName, userAccountId : string, userRole : string) : Promise<string>
    resetPassword(data : IResetPassword, userRole : string) : Promise<boolean>
    changePaassword(data : IChangePassword, accountId : string) : Promise<boolean>
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
        const account = await this.accountRepository.findAccountWithRoleAndOrganization(accountId);
        if (!account) throw new DataNotFound("ACCOUNT404");
        if (!account.role) throw Error("Error in getting role from this account");
        if (!account.organization) throw Error("Error in getting organization from this account");

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

    async checkUsernameAvailable(username: string): Promise<boolean> {
        const usernameExist = await this.accountRepository.findAccountByUsername(username);
        if (usernameExist) return false;
        return true;
    }

    async checkEmailAvailable(email: string): Promise<boolean> {
        const emailExist = await this.accountRepository.findAccountByEmail(email);
        if (emailExist) return false;
        return true;
    }

    async editAccount(data: IEditAccount, userAccountId: string, userRole: string): Promise<EditAccountReturn> {
        
        const process = data.process;

        let message = "";
        let newValue = "";

        if (process === EditAccountProcessEnum.USERNAME) {
            if (data.value.length > 20) {
                throw new NotValid("ACCOUNT400-1"); // Username cannot be more than 20 characters.
            }
            newValue = await this.changeUsername({
                accountId: data.accountId,
                newUsername: data.value
            }, userAccountId, userRole);
            message = "username changed";
        } else if (process === EditAccountProcessEnum.EMAIL) {
            if (data.value.length > 50) {
                throw new NotValid("ACCOUNT400-2"); // Email cannot be more than 50 characters.
            }
            newValue = await this.changeEmail({
                accountId: data.accountId,
                newEmail: data.value
            }, userAccountId, userRole);
            message = "email changed";
        } else if (process === EditAccountProcessEnum.NAME) {
            newValue = await this.changeName({
                accountId: data.accountId,
                newName: data.value
            }, userAccountId, userRole);
            message = "name changed";
        } else {
            throw new WrongFormat("process must be either username, email, or name");
        }

        return {
            message : message,
            newValue : newValue
        }
    }

    async changeUsername(data: IChangeUsername, userAccountId: string, userRole : string): Promise<string> {

        // check if username is available
        const isAvailable = await this.checkUsernameAvailable(data.newUsername);
        if (!isAvailable) throw new ExistData("ACCOUNT409-1"); // Username already used.

        const account = await this.accountRepository.findAccountById(data.accountId);
        if (!account) throw new DataNotFound("account not found");
        if (!account.role) throw new Error("something wrong when getting role data");

        // Check if user allowed to change account with specific role's username
        if (account.account_id !== userAccountId) {
            const isAllowed = this.checkRoleEligibility(userRole, account.role.role_name);
            if (!isAllowed) throw new Forbidden("you dont have permission to do this action");
        }

        account.username = data.newUsername;
        const updatedAccount = await account.save();

        return updatedAccount.username;
    }

    async changeEmail(data: IChangeEmail, userAccountId: string, userRole : string): Promise<string> {

        // check if email is available
        const isAvailable = await this.checkEmailAvailable(data.newEmail);
        if (!isAvailable) throw new ExistData("ACCOUNT409-2"); // Email already used.

        const account = await this.accountRepository.findAccountById(data.accountId);
        if (!account) throw new DataNotFound("account not found");
        if (!account.role) throw new Error("something wrong when getting role data");

        // Check if user allowed to change account with specific role's email
        if (account.account_id !== userAccountId) {
            const isAllowed = this.checkRoleEligibility(userRole, account.role.role_name);
            if (!isAllowed) throw new Forbidden("you dont have permission to do this action");
        }

        account.email = data.newEmail;
        const updatedAccount = await account.save();

        return updatedAccount.email;
    }

    async changeName(data: IChangeName, userAccountId: string, userRole : string): Promise<string> {

        const account = await this.accountRepository.findAccountById(data.accountId);
        if (!account) throw new DataNotFound("account not found");
        if (!account.role) throw new Error("something wrong when getting role data");

        // Check if user allowed to change account with specific role's email
        if (account.account_id !== userAccountId) {
            const isAllowed = this.checkRoleEligibility(userRole, account.role.role_name);
            if (!isAllowed) throw new Forbidden("you dont have permission to do this action");
        }

        account.name = data.newName;
        const updatedAccount = await account.save();

        return updatedAccount.name;
    }

    async resetPassword(data: IResetPassword, userRole : string): Promise<boolean> {
        const account = await this.accountRepository.findAccountById(data.accountId);
        if (!account) throw new DataNotFound("account not found");
        if (!account.role) throw new Error("something wrong when getting role data");
        
        // Check if user allowed to change account with specific role's password
        const isAllowed = this.checkRoleEligibility(userRole, account.role.role_name);
        if (!isAllowed) throw new Forbidden("you dont have permission to do this action");

        // change password
        return this.changePasswordHandler(account, data.newPassword);
    }

    async changePaassword(data: IChangePassword, accountId : string): Promise<boolean> {
        const account = await this.accountRepository.findAccountById(accountId);
        if (!account) throw new Error("something wrong when getting account");

        // compare password
        const isMatch = await this.hashProvider.compareHash(data.currentPassword, account.password);
        if (!isMatch) throw new Forbidden("Wrong password");

        // change password
        return this.changePasswordHandler(account, data.newPassword);
    }

    private async changePasswordHandler(account : Account, newPassword : string) : Promise<boolean> {

        // check if password format is valid
        const passwordValid = validatePassword(newPassword);
        if (!passwordValid.valid) {
            throw new WrongFormat(passwordValid.message);
        }

        // save password
        const hashedPassword = await this.hashProvider.hashString(newPassword);
        account.password = hashedPassword;
        await account.save();

        return true;
    }

    private checkRoleEligibility(userRole : string, targetRole : string) : boolean {
        let allowed = true;
        if (userRole !== DefaultRoleEnum.ADMIN && userRole !== DefaultRoleEnum.SUPER_ADMIN) {
            if (targetRole === DefaultRoleEnum.ADMIN || targetRole === DefaultRoleEnum.SUPER_ADMIN) {
                allowed = false;
            }
        }
        if (userRole === DefaultRoleEnum.ADMIN) {
            if (targetRole === DefaultRoleEnum.SUPER_ADMIN) allowed = false;
            if (targetRole === DefaultRoleEnum.ADMIN) allowed = false;
        }

        return allowed;
    }
}