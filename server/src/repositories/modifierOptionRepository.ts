import { Transaction } from "sequelize";
import { ModifierOption } from "../models";

export interface IModifierOptionRepository {
    findModifierOptionByModifier(modifierId : number) : Promise<ModifierOption[]>
    bulkCreateModifierOption(data : Partial<ModifierOption>[], transaction? : Transaction) : Promise<ModifierOption[]>
    destroyModifierOption(modifierId : number, transaction? : Transaction) : Promise<void>
}

export class ModifierOptionRepository implements IModifierOptionRepository {
    findModifierOptionByModifier(modifierId: number): Promise<ModifierOption[]> {
        return ModifierOption.findAll({
            where: {
                modifier_id : modifierId,
            },
        });
    }

    bulkCreateModifierOption(data: Partial<ModifierOption>[], transaction?: Transaction): Promise<ModifierOption[]> {
        return ModifierOption.bulkCreate(data, { transaction });
    }

    async destroyModifierOption(modifierId: number, transaction?: Transaction): Promise<void> {
        ModifierOption.destroy({
            where: {
                modifier_id : modifierId
            },
            transaction
        });
    }
}