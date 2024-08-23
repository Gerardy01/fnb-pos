import Organization from "../models/organization.model";

// types and interfaces
import { Transaction } from "sequelize";
export interface IOrganizationRepository {
    findOneOrganization(id: string): Promise<Organization | null>;
    findAllOrganization(): Promise<Organization[]>;
    findOrganizationByNo(organizationNo : string) : Promise<Organization | null>;
    createOrganization(data : Partial<Organization>, transaction? : Transaction): Promise<Organization>;
}



export class OrganizationRepository implements IOrganizationRepository {
    findOneOrganization(id: string): Promise<Organization | null> {
        return Organization.findOne({
            where: {
                organization_id:id
            }
        });
    }
    findAllOrganization(): Promise<Organization[]> {
        return Organization.findAll();
    }
    findOrganizationByNo(organizationNo: string): Promise<Organization | null> {
        return Organization.findOne({
            where: {
                organization_no : organizationNo
            }
        });
    }
    createOrganization(data: Partial<Organization>, transaction? : Transaction): Promise<Organization> {
        return Organization.create(data, { transaction });
    }
}