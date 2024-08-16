// services
import { OrganizationService } from "./organizationService";
import { CounterService } from "./counterService";

// repository
import { OrganizationRepository } from "../repositories/organizationRepository";
import { CounterRepository } from "../repositories/counterRepository";



const organizationRepository = new OrganizationRepository();
const counterRepository = new CounterRepository();

// unexposed service
const counterService = new CounterService(counterRepository);


// main service
export const organizationService = new OrganizationService(organizationRepository, counterService);


// combined service