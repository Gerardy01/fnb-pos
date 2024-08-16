
// types and inerfaces
import { IOrganizationService } from "./organizationService";


export interface IOrganizationAccountService {
    createOrganizationWithAccount() : void
}

export class OrganizationAccountSerivice {
    constructor(
        private organizationService : IOrganizationService
    ) {}

    async createOrganizationWithAccount() {

    }
}