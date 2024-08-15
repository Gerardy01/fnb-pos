import { ICreateOrganizationData } from "../interfaces/IOrganization";
import { IOrganizationRepository } from "../repositories/organizationRepository";

// types and interfaces
import { OrganizationDataReturn } from "../interfaces/IOrganization";

// exceptions
import { NotEpoch } from "../utility/exceptions";

export default class OrganizationService {
    constructor(
        private organizationRepository: IOrganizationRepository,
    ) {}

    async createOrganization(data : ICreateOrganizationData) : Promise<OrganizationDataReturn> {
        
        const endValidDatetimeConverted : Date = new Date(data.endValidDatetime);

        const newOrganization = await this.organizationRepository.createOrganization({
            organization_name: data.organizationName,
            organization_logo: undefined,
            organization_no: "system",
            end_valid_datetime: endValidDatetimeConverted
        });

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