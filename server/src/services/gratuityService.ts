

// utils
import { ExistData, Forbidden } from "../utility/exceptions";
import { GratuityCalculationTypeEnum } from "../utility/enums";

// types and interfaces
import { GratuityReturnData, ICreateGratuityData } from "../interfaces/IGratuity";
import { IGratuityRepository } from "../repositories/gratuityRepository";
import { Transaction } from "sequelize";
export interface IGratuityService {
    getAllGratuity(organizationId : string) : Promise<GratuityReturnData[]>
    createGratuity(data : ICreateGratuityData, organizationId : string, transaction? : Transaction) : Promise<GratuityReturnData>
}


export class GratuityService implements IGratuityService {
    constructor(
        private gratuityRepository : IGratuityRepository,
    ) {}

    async getAllGratuity(organizationId: string): Promise<GratuityReturnData[]> {

        const gratuities = await this.gratuityRepository.findGratuityByOrganization(organizationId);

        const gratuityList : GratuityReturnData[] = [];
        gratuities.forEach(item => {
            gratuityList.push({
                gratuityId : item.gratuity_id,
                name : item.name,
                writtenName : item.written_name,
                amount : item.amount,
                calculationType : item.calculation_type,
            });
        });

        return gratuityList;
    }

    async createGratuity(data: ICreateGratuityData, organizationId: string, transaction? : Transaction): Promise<GratuityReturnData> {

        // check name exist
        const nameExist = await this.gratuityRepository.findGratuityByOrganizationAndName(organizationId, data.name);
        if (nameExist) throw new ExistData("GRATUITY409-1");

        // check calculation type valid
        if (!Object.values(GratuityCalculationTypeEnum).includes(data.calculationType)) {
            throw new Forbidden("Calculation type doesn't exist")
        }

        const newGratuity = await this.gratuityRepository.createGratuity({
            name : data.name,
            written_name : data.writtenName,
            amount : data.amount,
            calculation_type : data.calculationType,
            organization_id : organizationId,
        }, transaction);
        
        return {
            gratuityId : newGratuity.gratuity_id,
            name : newGratuity.name,
            writtenName : newGratuity.written_name,
            amount : newGratuity.amount,
            calculationType : newGratuity.calculation_type,
        }
    }
}