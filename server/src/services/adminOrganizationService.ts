
// types and interfaces
import { Transaction } from "sequelize";
import { IAdminOrganizationRepository } from "../repositories/adminOrganizationRepository";
export interface IAdminOrganizationService {
    updateOrCreateAdminOrganization(accountId : string, organizationId : string, transaction? : Transaction) : Promise<void>
}

export class AdminOrganizationService implements IAdminOrganizationService {
    constructor(
        private adminOrganizationRepository : IAdminOrganizationRepository
    ) {}

    async updateOrCreateAdminOrganization(accountId: string, organizationId : string, transaction?: Transaction): Promise<void> {
        
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