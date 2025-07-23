import { Op, Transaction } from "sequelize";
import { Modifier, ModifierOption } from "../models";


export interface IModifierRepository {
    findModifierByOrganization(organizationId : string, includeOptions? : boolean) : Promise<Modifier[]>
    findModifierById(modifierId : number) : Promise<Modifier | null>
    findModifierByName(name : string, organizationId : string) : Promise<Modifier | null>
    createModifier(data : Partial<Modifier>, transaction? : Transaction) : Promise<Modifier>
}

export class ModifierRepository implements IModifierRepository {
    findModifierByOrganization(organizationId: string, includeOptions?: boolean): Promise<Modifier[]> {
        if (!includeOptions) {
            return Modifier.findAll({
                where : {
                    organization_id : organizationId,
                    archived : false,
                }
            });
        }

        return Modifier.findAll({
            where : {
                organization_id : organizationId,
                archived : false,
            },
            include: [
                {
                    model: ModifierOption,
                    as: 'modifier_options',
                    required : false,
                }
            ]
        });
    }

    findModifierById(modifierId: number): Promise<Modifier | null> {
        return Modifier.findOne({
            where: {
                modifier_id : modifierId,
                archived : false,
            }
        });
    }

    findModifierByName(name: string, organizationId: string): Promise<Modifier | null> {
        return Modifier.findOne({
            where: {
                name : {
                    [Op.iLike] : name,
                },
                organization_id : organizationId,
                archived : false,
            }
        });
    }

    createModifier(data: Partial<Modifier>, transaction?: Transaction): Promise<Modifier> {
        return Modifier.create(data, { transaction });
    }
}