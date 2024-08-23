
// types and inerfaces
import { Transaction } from "sequelize";
import { createOrganizationWithAccountData, OrganizationDataReturn } from "../interfaces/IOrganization";
import { IAccountService } from "./accountService";
import { IOrganizationService } from "./organizationService";
import { AccountDataReturn, ICreateSuperAdminData } from "../interfaces/IAccount";
import { IOrganizationRepository } from "../repositories/organizationRepository";
export interface IOrganizationAccountService {
    createOrganizationWithAccount(data : createOrganizationWithAccountData, transaction? : Transaction) : Promise<OrganizationDataReturn>
    createSuperAdmin(data : ICreateSuperAdminData) : Promise<AccountDataReturn>
}



export class OrganizationAccountSerivice implements IOrganizationAccountService {
    constructor(
        private organizationService : IOrganizationService,
        private accountSerivce : IAccountService,
        private organizationRepository : IOrganizationRepository,
    ) {}

    async createOrganizationWithAccount(data: createOrganizationWithAccountData, transaction? : Transaction): Promise<OrganizationDataReturn> {
        const organization : OrganizationDataReturn = await this.organizationService.createOrganization({
            organizationName : data.organizationName,
            endValidDatetime : data.endValidDatetime,
        }, transaction);

        const account = await this.accountSerivce.createAccountForManagement({
            username : data.username,
            name : data.name,
            email : data.email,
            password : data.password,
            organizationId : organization.organizationId
        }, transaction);

        return {
            organizationId : organization.organizationId,
            organizationName : organization.organizationName,
            organizationLogo : organization.organizationLogo,
            organizationNo : organization.organizationNo,
            archived : organization.archived,
            endValidDatetime : organization.endValidDatetime,
        }
    }

    async createSuperAdmin(data: ICreateSuperAdminData): Promise<AccountDataReturn> {
        const systemOrganization = await this.organizationRepository.findOrganizationByNo("system");
        if (!systemOrganization) throw Error("system organization does not exist");

        const newAccount = await this.accountSerivce.createAccountForManagement({
            username : data.username,
            name : data.name,
            email : data.email,
            password : data.password,
            organizationId : systemOrganization.organization_id
        }, undefined, true);
        
        return {
            accountId : newAccount.accountId,
            username : newAccount.username,
            name : newAccount.name,
            email : newAccount.email,
            organizationId : newAccount.organizationId,
            roleId : newAccount.roleId,
            roleName : newAccount.roleName,
            archived : newAccount.archived,
        }
    }
}