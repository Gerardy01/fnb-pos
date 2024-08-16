import Organization from "../models/organization.model";

// types and interfaces
import { Transaction } from "sequelize";
export interface IOrganizationRepository {
    findOneOrganization(id: string): Promise<Organization | null>
    findAllOrganization(): Promise<Organization[]>;
    createOrganization(data : Partial<Organization>, transaction? : Transaction): Promise<Organization>;
}



export class OrganizationRepository implements IOrganizationRepository {
    findOneOrganization(id: string): Promise<Organization | null> {
        return Organization.findOne({
            where: {
                organization_id:id
            }
        })
    }
    findAllOrganization(): Promise<Organization[]> {
        return Organization.findAll();
    }
    createOrganization(data: Partial<Organization>, transaction? : Transaction): Promise<Organization> {
        return Organization.create(data, { transaction });
    }
}