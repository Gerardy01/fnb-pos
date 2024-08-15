// services
import OrganizationService from "./organizationService";

// repository
import { OrganizationRepository } from "../repositories/organizationRepository";



const organizationRepository = new OrganizationRepository();


export const organizationService = new OrganizationService(organizationRepository);