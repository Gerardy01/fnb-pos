
// utils
import { DefaultRoleEnum } from "../utility/enums";

// exceptions
import { ExistData, DataNotFound } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import { IAccountDataReturn, ICreateAccountData, ICreateAccountForManagementData } from "../interfaces/IAccount";
import { IAccountRepository } from "../repositories/accountRepository";
import { IRoleRepository } from "../repositories/roleRepository";
export interface IAccountService {
    createAccount(data : ICreateAccountData, transaction? : Transaction) : Promise<IAccountDataReturn>
    createAccountForManagement(data : ICreateAccountForManagementData, transaction? : Transaction) : Promise<IAccountDataReturn>
}



export class AccountService implements IAccountService {
    constructor(
        private accountRepository : IAccountRepository,
        private roleRepository : IRoleRepository,
    ) {}

    async createAccount(data: ICreateAccountData, transaction?: Transaction,): Promise<IAccountDataReturn> {

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
        const role = await this.roleRepository.roleExistQuery(data.roleId, data.organizationId);
        if (!role) {
            throw new DataNotFound("Role not found");
        }

        return {
            accountId : "",
            username : "",
            name : "",
            email : "",
            organizationId : "",
            roleId : 0,
            roleName : "",
            archived : false,
        }
    }
    async createAccountForManagement(data: ICreateAccountForManagementData, transaction?: Transaction): Promise<IAccountDataReturn> {
        
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

        const role = await this.roleRepository.findRoleByname(DefaultRoleEnum.ADMIN);
        if (!role) {
            throw new DataNotFound("Role not found");
        }

        return {
            accountId : "",
            username : "",
            name : "",
            email : "",
            organizationId : "",
            roleId : 0,
            roleName : "",
            archived : false,
        }
    }
}