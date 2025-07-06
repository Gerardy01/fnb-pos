
// models
import { Account } from "../models";

// utils
import { DefaultRoleEnum, EditAccountProcessEnum } from "../utility/enums";
import { generateRandomPassword, validateEmail, validatePassword, validateUsername } from "../utility/utils";

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
    IChangeUsername,
    IChangeEmail,
    IChangeName,
    IEditAccount,
    EditAccountReturn,
    AccountDataReturnExtended,
    IEditAccountManagementData,
    IForgotPasswordChange
} from "../interfaces/IAccount";
import { IAccountRepository } from "../repositories/accountRepository";
import { IHashProvider } from "../providers/hashProvider";
import { IRolePermissionService } from "./rolePermissionService";
import { IOtpAuthRepository } from "../repositories/otpAuthRepository";
import { ITokenAuthRepository } from "../repositories/tokenAuthRepository";
import { IAccountOutletRepository } from "../repositories/accountOutletRepository";
import { IOutletRepository } from "../repositories/outletRepository";
import AccountOutlets from "../models/accountOutlet.model";
export interface IAccountService {
    getAllAccount(organizationId : string, userRole : string, userAccountId : string) : Promise<AccountDataReturn[]>
    getAccountById(accountId : string) : Promise<AccountDataReturn>
    getUserAccountInfo(accountId : string) : Promise<AccountInfoReturn>
    getAccountForLogin(identifier : string) : Promise<AccountDataReturnExtended>
    createAccount(data : ICreateAccountData, organizationId : string, userRole : string, transaction? : Transaction) : Promise<AccountDataReturn>
    createAccountForSystem(data : ICreateAccountForManagementData, transaction? : Transaction, forSuperAdmin? : boolean) : Promise<AccountDataReturn>
    checkUsernameAvailable(username : string) : Promise<boolean>
    checkEmailAvailable(email : string) : Promise<boolean>
    editAccount(data : IEditAccount, userAccountId : string, userRole : string) : Promise<EditAccountReturn>
    changeUsername(data : IChangeUsername, userAccountId : string, userRole : string) : Promise<string>
    changeEmail(data : IChangeEmail, userAccountId : string, userRole : string) : Promise<string>
    changeName(data : IChangeName, userAccountId : string, userRole : string) : Promise<string>
    resetPassword(accountId : string, userRole : string) : Promise<string>
    changePassword(data : IChangePassword, accountId : string) : Promise<boolean>
    forgotPasswordChange(data : IForgotPasswordChange) : Promise<boolean>
    editAccountManagement(data : IEditAccountManagementData, organizationId : string, userRole : string, transaction? : Transaction) : Promise<AccountDataReturn>
    deleteAccount(accountId : string, organizationId : string) : Promise<boolean>
}



export class AccountService implements IAccountService {
    constructor(
        private rolePermissionService : IRolePermissionService,
        private accountRepository : IAccountRepository,
        private otpAuthRepository : IOtpAuthRepository,
        private tokenAuthRepository : ITokenAuthRepository,
        private outletRepository : IOutletRepository,
        private accountOutletRepository : IAccountOutletRepository,
        private hashProvider : IHashProvider,
    ) {}

    async getAllAccount(organizationId: string, userRole: string, userAccountId: string): Promise<AccountDataReturn[]> {

        let accounts = await this.accountRepository.findAllAccountByOrganization(organizationId);

        if (accounts.length === 0) throw new DataNotFound("no account found");

        // exclude user own account
        accounts = accounts.filter(item => item.account_id !== userAccountId);

        // exclude ADMIN if user not SUPER ADMIN
        if (userRole !== DefaultRoleEnum.SUPER_ADMIN) {
            accounts = accounts.filter(item => item.role?.role_name !== DefaultRoleEnum.ADMIN);
        }

        // map account data to return
        const accountReturnList : AccountDataReturn[] = [];
        accounts.forEach(item => {
            if (userRole !== DefaultRoleEnum.SUPER_ADMIN && item.archived) return;
            accountReturnList.push({
                accountId : item.account_id,
                username : item.username,
                name : item.name,
                email : item.email,
                organizationId : item.organization_id,
                roleId : item.role_id,
                roleName : item.role ? item.role.role_name : "",
                archived : item.archived
            });
        });

        return accountReturnList;
    }

    // only use between services
    async getAccountById(accountId: string) {

        const account = await this.accountRepository.findAccountById(accountId);
        if (!account) throw new Error("something wrong on getting account. make sure this service not exposed to api");

        return {
            accountId : account.account_id,
            username : account.username,
            name : account.name,
            email : account.email,
            organizationId : account.organization_id,
            roleId : account.role_id,
            roleName : account.role ? account.role.role_name : "",
            archived : account.archived
        }
    }

    async getUserAccountInfo(accountId: string): Promise<AccountInfoReturn> {

        // get account
        const account = await this.accountRepository.findAccountById(accountId);
        if (!account) throw new DataNotFound("ACCOUNT404");
        if (!account.role) throw Error("Error in getting role from this account");
        if (!account.organization) throw Error("Error in getting organization from this account");

        // get page access permission
        const pageAccessPermissions = await this.rolePermissionService.getPageAccessPermissionByRole(account.role.role_id);
        const pageAccessPermissionIds = pageAccessPermissions.map(item => item.permissionId);
        
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

    async getAccountForLogin(identifier: string): Promise<AccountDataReturnExtended> {

        const account = await this.accountRepository.findAccountByEmailOrUsername(identifier);
        if (!account) throw new DataNotFound("AUTH001");

        return {
            accountId : account.account_id,
            username : account.username,
            name : account.name,
            email : account.email,
            organizationId : account.organization_id,
            roleId : account.role_id,
            roleName : account.role ? account.role.role_name : "",
            archived : account.archived,
            password : account.password,
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
        const usernameAvailable = await this.checkUsernameAvailable(data.username);
        if (!usernameAvailable) {
            throw new ExistData("ACCOUNT409-1");
        }

        if (data.email) {
            const emailValid = validateEmail(data.email);
            if (!emailValid.valid) throw new WrongFormat(emailValid.message);
        }

        // check duplicate email
        const inputedEmail = data.email ? data.email : "";
        const emailAvailable = await this.checkEmailAvailable(inputedEmail);
        if (inputedEmail !== "" && !emailAvailable) {
            throw new ExistData("ACCOUNT409-2");
        }

        // check if role exist
        const role = await this.rolePermissionService.getOneRole(data.roleId, organizationId, userRole);
        
        // check email OTP
        if (inputedEmail !== "") {
            if (!data.otpCode) throw new NotValid("ACCOUNT403-6");
            const otpValid = await this.validateOtpValid(data.otpCode, inputedEmail);
            if (!otpValid) throw new NotValid("ACCOUNT403-6");
        }

        // outlet validation
        const outletIds = this.removeDuplicateOutlets(data.outletIds);
        const outlets = await this.outletRepository.findOutletByIds(outletIds, organizationId);
        const foundOutlets = outlets.map(outlet => outlet.outlet_id);
        if (foundOutlets.length !== outletIds.length) {
            const missingOutletIds = outletIds.filter(id => !foundOutlets.includes(id));
            throw new DataNotFound(`Outlet with id ${missingOutletIds.join(', ')} does not exist`)
        }

        const hashedPassword = await this.hashProvider.hashString(data.password);

        // create account
        const account = await this.accountRepository.createAccount({
            username : data.username,
            name : data.name,
            email : inputedEmail,
            password : hashedPassword,
            organization_id : organizationId,
            role_id: role.roleId,
        }, transaction);
        
        // create account's outlet
        const accountOutletList : Partial<AccountOutlets>[] = [];
        outletIds.forEach(item => {
            accountOutletList.push({
                account_id : account.account_id,
                outlet_id : item
            });
        });
        await this.accountOutletRepository.bulkCreateAccountOutlet(accountOutletList, transaction);

        return {
            accountId : account.account_id,
            username : account.username,
            name : account.name,
            email : account.email,
            organizationId : account.organization_id,
            roleId : account.role_id,
            roleName : role.roleName,
            archived : account.archived,
        }
    }

    async createAccountForSystem(data: ICreateAccountForManagementData, transaction?: Transaction, forSuperAdmin : boolean = false): Promise<AccountDataReturn> {
        
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
        const usernameAvailable = await this.checkUsernameAvailable(data.username);
        if (!usernameAvailable) {
            throw new ExistData("Username already exist");
        }

        if (data.email) {
            const emailValid = validateEmail(data.email);
            if (!emailValid.valid) throw new WrongFormat(emailValid.message);
        }

        // check duplicate email
        const inputedEmail = data.email ? data.email : "";
        const emailAvailable = await this.checkEmailAvailable(inputedEmail);
        if (inputedEmail !== "" && !emailAvailable) {
            throw new ExistData("Email already exist");
        }
        
        const role = await this.rolePermissionService.getDefaultRoleByName(forSuperAdmin ? DefaultRoleEnum.SUPER_ADMIN : DefaultRoleEnum.ADMIN)
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
            role_id: role.roleId,
        }, transaction);

        return {
            accountId : account.account_id,
            username : account.username,
            name : account.name,
            email : account.email,
            organizationId : account.organization_id,
            roleId : account.role_id,
            roleName : role.roleName,
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
                throw new NotValid("ACCOUNT403-2"); // Username cannot be more than 20 characters.
            }
            if (data.value.length === 0) {
                throw new NotValid("ACCOUNT403-4"); // This field is required.
            }
            newValue = await this.changeUsername({
                accountId: data.accountId,
                newUsername: data.value
            }, userAccountId, userRole);
            message = "username changed";
        } else if (process === EditAccountProcessEnum.EMAIL) {
            if (data.value.length > 50) {
                throw new NotValid("ACCOUNT403-3"); // Email cannot be more than 50 characters.
            }

            // check email OTP
            if (!data.otpCode) throw new NotValid("ACCOUNT403-6");
            const otpValid = await this.validateOtpValid(data.otpCode, data.value);
            if (!otpValid) throw new NotValid("ACCOUNT403-6");
            
            newValue = await this.changeEmail({
                accountId: data.accountId,
                newEmail: data.value
            }, userAccountId, userRole);
            message = "email changed";
        } else if (process === EditAccountProcessEnum.NAME) {
            if (data.value.length === 0) {
                throw new NotValid("ACCOUNT403-4"); // This field is required.
            }
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

        // check if username valid
        const usernameValid = validateUsername(data.newUsername);
        if (!usernameValid.valid) throw new WrongFormat(usernameValid.message);

        // check if username is available
        const isAvailable = await this.checkUsernameAvailable(data.newUsername);
        if (!isAvailable) throw new ExistData("ACCOUNT409-1"); // Username already used.

        const account = await this.accountRepository.findAccountById(data.accountId);
        if (!account) throw new DataNotFound("account not found");
        if (!account.role) throw new Error("something wrong when getting role data");

        // Check if user allowed to change account with specific role's username
        if (account.account_id !== userAccountId) {
            const isAllowed = this.checkRoleEligibility(userRole, account.role.role_name);
            if (!isAllowed) throw new Forbidden("ACCOUNT403-5"); // You dont have permission to do this action
        }

        account.username = data.newUsername;
        const updatedAccount = await account.save();

        return updatedAccount.username;
    }

    async changeEmail(data: IChangeEmail, userAccountId: string, userRole : string): Promise<string> {

        if (data.newEmail) {
            // check if email valid
            const emailValid = validateEmail(data.newEmail);
            if (!emailValid.valid) throw new WrongFormat(emailValid.message);
            
            // check if email is available
            const isAvailable = await this.checkEmailAvailable(data.newEmail);
            if (!isAvailable) throw new ExistData("ACCOUNT409-2"); // Email already used.
        }


        const account = await this.accountRepository.findAccountById(data.accountId);
        if (!account) throw new DataNotFound("account not found");
        if (!account.role) throw new Error("something wrong when getting role data");

        // Check if user allowed to change account with specific role's email
        if (account.account_id !== userAccountId) {
            const isAllowed = this.checkRoleEligibility(userRole, account.role.role_name);
            if (!isAllowed) throw new Forbidden("ACCOUNT403-5"); // You dont have permission to do this action
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
            if (!isAllowed) throw new Forbidden("ACCOUNT403-5"); // You dont have permission to do this action
        }

        account.name = data.newName;
        const updatedAccount = await account.save();

        return updatedAccount.name;
    }

    async resetPassword(accountId : string, userRole : string): Promise<string> {
        const account = await this.accountRepository.findAccountById(accountId);
        if (!account) throw new DataNotFound("account not found");
        if (!account.role) throw new Error("something wrong when getting role data");
        
        // Check if user allowed to change account with specific role's password
        const isAllowed = this.checkRoleEligibility(userRole, account.role.role_name);
        if (!isAllowed) throw new Forbidden("you dont have permission to do this action");

        // generate password
        const newPass = generateRandomPassword();
        await this.changePasswordHandler(account, newPass, false);
        
        return newPass;
    }

    async changePassword(data: IChangePassword, accountId : string): Promise<boolean> {
        const account = await this.accountRepository.findAccountById(accountId);
        if (!account) throw new Error("something wrong when getting account");

        // compare password
        const isMatch = await this.hashProvider.compareHash(data.currentPassword, account.password);
        if (!isMatch) throw new Forbidden("Wrong password");

        // change password
        return this.changePasswordHandler(account, data.newPassword);
    }

    async forgotPasswordChange(data: IForgotPasswordChange): Promise<boolean> {

        const currentDate = new Date();

        const tokenAuth = await this.tokenAuthRepository.findByToken(data.token);
        if (!tokenAuth || tokenAuth.expires_at < currentDate) throw new DataNotFound("token not match");
        if (!tokenAuth.account) throw new Error("error when getting account");
        
        this.changePasswordHandler(tokenAuth.account, data.newPassword);

        tokenAuth.used = true;
        tokenAuth.save();

        return true;
    }

    async editAccountManagement(data : IEditAccountManagementData, organizationId : string, userRole : string, transaction? : Transaction) : Promise<AccountDataReturn> {
        
        const account = await this.accountRepository.findAccountByIdAndOrganization(data.accountId, organizationId);
        if (!account) throw new DataNotFound("account not found");

        // check if username format is valid
        const usernameValid = validateUsername(data.username);
        if (!usernameValid.valid) {
            throw new WrongFormat(usernameValid.message);
        }

        // check duplicate username
        const usernameAvailable = await this.checkUsernameAvailable(data.username);
        if (!usernameAvailable && (data.username !== account.username)) {
            throw new ExistData("ACCOUNT409-1");
        }

        if (data.email) {
            const emailValid = validateEmail(data.email);
            if (!emailValid.valid) {
                throw new WrongFormat(emailValid.message);
            }
        }

        // check duplicate email
        const inputedEmail = data.email ? data.email : "";
        const emailAvailable = await this.checkEmailAvailable(inputedEmail);
        if (inputedEmail !== "" && !emailAvailable && (data.email !== account.email)) {
            throw new ExistData("ACCOUNT409-2");
        }

        // check if role exist
        const role = await this.rolePermissionService.getOneRole(data.roleId, organizationId, userRole);

        // check email OTP
        if (inputedEmail !== account.email && inputedEmail !== "") {
            if (!data.otpCode) throw new NotValid("ACCOUNT403-6");
            const otpValid = await this.validateOtpValid(data.otpCode, inputedEmail);
            if (!otpValid) throw new NotValid("ACCOUNT403-6");
        }

        // outlet validation
        const outletIds = this.removeDuplicateOutlets(data.outletIds);
        const outlets = await this.outletRepository.findOutletByIds(outletIds, organizationId);
        const foundOutlets = outlets.map(outlet => outlet.outlet_id);
        if (foundOutlets.length !== outletIds.length) {
            const missingOutletIds = outletIds.filter(id => !foundOutlets.includes(id));
            throw new DataNotFound(`Outlet with id ${missingOutletIds.join(', ')} does not exist`)
        }
        
        account.username = data.username;
        account.name = data.name;
        account.email = data.email;
        account.role_id = role.roleId;

        const editedAccount = await account.save({ transaction });

        await this.accountOutletRepository.destroyAccountOutlet(account.account_id, transaction);
        const accountOutletList : Partial<AccountOutlets>[] = [];
        outletIds.forEach(item => {
            accountOutletList.push({
                account_id : account.account_id,
                outlet_id : item
            });
        });
        await this.accountOutletRepository.bulkCreateAccountOutlet(accountOutletList, transaction);
        
        return {
            accountId : editedAccount.account_id,
            username : editedAccount.username,
            name : editedAccount.name,
            email : editedAccount.email,
            organizationId : editedAccount.organization_id,
            roleId : editedAccount.role_id,
            roleName : role.roleName,
            archived : editedAccount.archived,
        }
    }

    async deleteAccount(accountId: string, organizationId : string): Promise<boolean> {
        const account = await this.accountRepository.findAccountByIdAndOrganization(accountId, organizationId);
        if (!account) throw new DataNotFound("account not found");

        account.archived = true;
        account.save();

        return true;
    }

    private async changePasswordHandler(account : Account, newPassword : string, validateFormat : boolean = true) : Promise<boolean> {

        // check if password format is valid
        const passwordValid = validatePassword(newPassword);
        if (!passwordValid.valid && validateFormat) {
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

    private async validateOtpValid(code : number, address : string) : Promise<boolean> {
        const currentDate = new Date();
        const validOtp = await this.otpAuthRepository.findActiveOtpsByCode(code);
        if (!validOtp || validOtp.send_to !== address || (validOtp && validOtp.expires_at < currentDate)) return false;

        await this.otpAuthRepository.revokeActiveOtpByAddress(address);
        return true;
    }

    private removeDuplicateOutlets(outletIds : string[]) : string[] {
        const uniqueOutletIds = new Set(outletIds);
        return Array.from(uniqueOutletIds);
    }
}