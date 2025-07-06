import { Op, Transaction } from "sequelize";
import { Gratuity } from "../models";


export interface IGratuityRepository {
    findGratuityById(gratuityId : number) : Promise<Gratuity | null>
    findGratuityByOrganization(organizationId : string) : Promise<Gratuity[]>
    findGratuityByOrganizationAndName(organizationId : string, name : string) : Promise<Gratuity | null>
    findGratuityByIds(gratuityIds : number[], organizationId : string) : Promise<Gratuity[]>
    createGratuity(data : Partial<Gratuity>, transaction? : Transaction) : Promise<Gratuity>
}

export class GratuityRepository implements IGratuityRepository {
    findGratuityById(gratuityId: number): Promise<Gratuity | null> {
        return Gratuity.findOne({
            where: {
                gratuity_id : gratuityId,
                archived : false,
            }
        });  
    }
    
    findGratuityByOrganization(organizationId: string): Promise<Gratuity[]> {
        return Gratuity.findAll({
            where: {
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    findGratuityByOrganizationAndName(organizationId: string, name: string): Promise<Gratuity | null> {
        return Gratuity.findOne({
            where: {
                name : {
                    [Op.iLike] : name,
                },
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    findGratuityByIds(gratuityIds: number[], organizationId: string): Promise<Gratuity[]> {
        return Gratuity.findAll({
            where: {
                gratuity_id : gratuityIds,
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    createGratuity(data: Partial<Gratuity>, transaction?: Transaction): Promise<Gratuity> {
        return Gratuity.create(data, { transaction });
    }
}