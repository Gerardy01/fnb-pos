import { AdminOrganization } from "../models";

// types and interfaces
import { Transaction } from "sequelize";
export interface IAdminOrganizationRepository {
    findByAccountId(accountId : string) : Promise<AdminOrganization | null>
    createAdminOrganization(data : Partial<AdminOrganization>, transaction? : Transaction) : Promise<AdminOrganization>
}


export class AdminOrganizationRepository implements IAdminOrganizationRepository {
    findByAccountId(accountId: string): Promise<AdminOrganization | null> {
        return AdminOrganization.findOne({
            where: {
                account_id : accountId
            }
        });
    }

    createAdminOrganization(data: Partial<AdminOrganization>, transaction?: Transaction): Promise<AdminOrganization> {
        return AdminOrganization.create(data, { transaction });
    }
}