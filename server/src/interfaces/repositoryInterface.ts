
// models
import Organization from "../models/organization.model"


export interface IOrganizationRepository {
    findOneOrganization(id: string): Promise<Organization | null>
    findAllOrganization(): Promise<Organization[]>;
    createOrganization(data : Partial<Organization>): Promise<Organization>;
}