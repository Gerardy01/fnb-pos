import { AdminOrganizationReturnData, ICreateOrganizationData, OrganizationInfoDataReturn } from "../interfaces/IOrganization";
import { IOrganizationRepository } from "../repositories/organizationRepository";

// utils
import { CounterContextEnum } from "../utility/enums";
import { generateOrganizationNumber } from "../utility/utils";
import { DataNotFound } from "../utility/exceptions";

// types and interfaces
import { Transaction } from "sequelize";
import { OrganizationDataReturn } from "../interfaces/IOrganization"; 
import { ICounterService } from "./counterService";
import { CounterDataReturn } from "../interfaces/ICounter";
import { IAdminOrganizationRepository } from "../repositories/adminOrganizationRepository";
export interface IOrganizationService {
    getOrganization(organizationId : string) : Promise<OrganizationDataReturn>
    getOrganizationInfo(organizationId : string) : Promise<OrganizationInfoDataReturn>
    getOrganizationByNo(organizationNo : string) : Promise<OrganizationDataReturn>
    getAdminOrganizationByAccount(accountId : string) : Promise<AdminOrganizationReturnData>
    createOrganization(data : ICreateOrganizationData, transaction? : Transaction) : Promise<OrganizationDataReturn>
    updateOrCreateAdminOrganization(accountId : string, organizationId : string, transaction? : Transaction) : Promise<void>
}



export class OrganizationService implements IOrganizationService {
    constructor(
        private counterService : ICounterService,
        private organizationRepository: IOrganizationRepository,
        private adminOrganizationRepository : IAdminOrganizationRepository,
    ) {}

    async getOrganization(organizationId: string): Promise<OrganizationDataReturn> {
        const organization = await this.organizationRepository.findOneOrganization(organizationId);
        if (!organization) throw new DataNotFound("organization not found");
        
        return {
            organizationId : organization.organization_id,
            organizationName : organization.organization_name,
            organizationLogo : organization.organization_logo,
            organizationNo : organization.organization_no,
            archived : organization.archived,
            endValidDatetime : organization.end_valid_datetime,
        }
    }

    async getOrganizationInfo(organizationId: string): Promise<OrganizationInfoDataReturn> {
        
        const organization = await this.organizationRepository.findOneOrganization(organizationId);
        if (!organization) throw new DataNotFound("organization not found");

        return {
            organizationId : organization.organization_id,
            organizationName : organization.organization_name,
            organizationLogo : organization.organization_logo,
            organizationNo : organization.organization_no
        }
    }

    async getOrganizationByNo(organizationNo: string): Promise<OrganizationDataReturn> {

        const organization = await this.organizationRepository.findOrganizationByNo(organizationNo);
        if (!organization) throw new DataNotFound("organization not found");
        
        return {
            organizationId : organization.organization_id,
            organizationName : organization.organization_name,
            organizationLogo : organization.organization_logo,
            organizationNo : organization.organization_no,
            archived : organization.archived,
            endValidDatetime : organization.end_valid_datetime,
        }
    }

    async getAdminOrganizationByAccount(accountId: string): Promise<AdminOrganizationReturnData> {

        const adminOrganization = await this.adminOrganizationRepository.findByAccountId(accountId);
        if (!adminOrganization) throw new Error("something wrong on getting admin organization");

        return {
            id : adminOrganization.id,
            accountId : adminOrganization.account_id,
            organizationId : adminOrganization.organization_id,
        }
    }

    async createOrganization(data : ICreateOrganizationData, transaction? : Transaction) : Promise<OrganizationDataReturn> {

        const endValidDatetimeConverted : Date = new Date(data.endValidDatetime);

        const organizationNoCount : CounterDataReturn = await this.counterService.updateOrCreateCounter(
            CounterContextEnum.ORGANIZATION_NO,
            transaction
        );
        const organizationNo : string = generateOrganizationNumber(data.organizationName, organizationNoCount.count);

        const newOrganization = await this.organizationRepository.createOrganization({
            organization_name: data.organizationName,
            organization_logo: undefined,
            organization_no: organizationNo,
            end_valid_datetime: endValidDatetimeConverted
        }, transaction);

        return {
            organizationId : newOrganization.organization_id,
            organizationName : newOrganization.organization_name,
            organizationLogo : newOrganization.organization_logo,
            organizationNo : newOrganization.organization_no,
            archived : newOrganization.archived,
            endValidDatetime : newOrganization.end_valid_datetime,
        }
    }

    async updateOrCreateAdminOrganization(accountId: string, organizationId: string, transaction?: Transaction): Promise<void> {
        let adminOrganization = await this.adminOrganizationRepository.findByAccountId(accountId);

        if (!adminOrganization) {
            const newAdminOrganization = await this.adminOrganizationRepository.createAdminOrganization({
                account_id : accountId,
                organization_id : organizationId
            }, transaction);
            adminOrganization = newAdminOrganization
        } else {
            adminOrganization.organization_id = organizationId;
            adminOrganization.save({ transaction });
        }
    }
}