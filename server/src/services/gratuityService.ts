

// utils
import { DataNotFound, ExistData, Forbidden } from "../utility/exceptions";
import { GratuityCalculationTypeEnum } from "../utility/enums";

// types and interfaces
import { GratuityReturnData, ICreateGratuityData, IEditGratuityData } from "../interfaces/IGratuity";
import { IGratuityRepository } from "../repositories/gratuityRepository";
import { Transaction } from "sequelize";
export interface IGratuityService {
    getAllGratuity(organizationId : string) : Promise<GratuityReturnData[]>
    getOneGratuity(gratuityId : number, organizationId : string) : Promise<GratuityReturnData>
    createGratuity(data : ICreateGratuityData, organizationId : string, transaction? : Transaction) : Promise<GratuityReturnData>
    editGratuity(data : IEditGratuityData, organizationId : string, transaction? : Transaction) : Promise<GratuityReturnData>
    deleteGratuity(gratuityId : number, organizationId : string) : Promise<boolean>
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

    async getOneGratuity(gratuityId: number, organizationId: string): Promise<GratuityReturnData> {
        
        const gratuity = await this.gratuityRepository.findGratuityById(gratuityId);
        if (!gratuity || gratuity.organization_id !== organizationId) throw new DataNotFound("Data not found");

        return {
            gratuityId : gratuity.gratuity_id,
            name : gratuity.name,
            writtenName : gratuity.written_name,
            amount : gratuity.amount,
            calculationType : gratuity.calculation_type,
        }
    }

    async createGratuity(data: ICreateGratuityData, organizationId: string, transaction? : Transaction): Promise<GratuityReturnData> {

        // check name exist
        const nameExist = await this.gratuityRepository.findGratuityByOrganizationAndName(organizationId, data.name);
        if (nameExist) throw new ExistData("GRATUITY409-1");

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

    async editGratuity(data: IEditGratuityData, organizationId: string, transaction?: Transaction): Promise<GratuityReturnData> {
        
        const targetGratuity = await this.gratuityRepository.findGratuityById(data.gratuityId);
        if (!targetGratuity || targetGratuity.organization_id !== organizationId) throw new DataNotFound("Data not found");

        // check name exist
        const nameExist = await this.gratuityRepository.findGratuityByOrganizationAndName(organizationId, data.name);
        if (nameExist && nameExist.gratuity_id !== targetGratuity.gratuity_id) throw new ExistData("GRATUITY409-1");

        targetGratuity.name = data.name;
        targetGratuity.written_name = data.writtenName;
        targetGratuity.amount = data.amount;
        targetGratuity.calculation_type = data.calculationType;

        await targetGratuity.save({ transaction });
        
        return {
            gratuityId : targetGratuity.gratuity_id,
            name : targetGratuity.name,
            writtenName : targetGratuity.written_name,
            amount : targetGratuity.amount,
            calculationType : targetGratuity.calculation_type,
        }
    }

    async deleteGratuity(gratuityId: number, organizationId: string): Promise<boolean> {
        
        const targetGratuity = await this.gratuityRepository.findGratuityById(gratuityId);
        if (!targetGratuity || targetGratuity.organization_id !== organizationId) throw new DataNotFound("Data not found");

        targetGratuity.archived = true;
        
        targetGratuity.save();
        
        return true;
    }
}