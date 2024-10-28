import { ICreateOrganizationData, OrganizationInfoDataReturn } from "../interfaces/IOrganization";
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
export interface IOrganizationService {
    getOrganizationInfo(organizationId : string) : Promise<OrganizationInfoDataReturn>
    createOrganization(data : ICreateOrganizationData, transaction? : Transaction) : Promise<OrganizationDataReturn>
}



export class OrganizationService implements IOrganizationService {
    constructor(
        private organizationRepository: IOrganizationRepository,
        private counterService : ICounterService,
    ) {}

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
}