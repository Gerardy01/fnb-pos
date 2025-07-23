
// utils
import { DataNotFound, ExistData, NotValid } from "../utility/exceptions";

// types and interfaces
import { ICreateModifierData, IEditModifierData, IModifierOption, ModifierReturnData } from "../interfaces/IModifier";
import { Transaction } from "sequelize";
import { IModifierRepository } from "../repositories/modifierRepository";
import { IModifierOptionRepository } from "../repositories/modifierOptionRepository";
import { ModifierOption } from "../models";
export interface IModifierService {
    getAllModifier(organizationId : string, includeOptions? : string) : Promise<ModifierReturnData[]>
    getOneModifier(modifierId : number, organizationId : string) : Promise<ModifierReturnData>
    createModifier(data : ICreateModifierData, organizationId : string, transaction? : Transaction) : Promise<ModifierReturnData>
    editModifier(data: IEditModifierData, organizationId : string, transaction? : Transaction) : Promise<ModifierReturnData>
    deleteModifier(modifierId : number, organizationId : string) : Promise<boolean>
}



export class ModifierService implements IModifierService {
    constructor(
        private modifierRepository : IModifierRepository,
        private modifierOptionRepository : IModifierOptionRepository,
    ) {}

    async getAllModifier(organizationId: string, includeOptions?: string): Promise<ModifierReturnData[]> {
        
        const isIncludeOptions = includeOptions === "true" ? true : false;
        const modifiers = await this.modifierRepository.findModifierByOrganization(organizationId, isIncludeOptions);

        const modifierList : ModifierReturnData[] = [];
        modifiers.forEach(item => {

            const modifierOptions : IModifierOption[] = [];
            item.modifier_options?.forEach(e => {
                modifierOptions.push({
                    // id : e.id,
                    optionName : e.option_name,
                    price : e.price,
                });
            });

            modifierList.push({
                modifierId : item.modifier_id,
                name : item.name,
                modifierOptions : modifierOptions,
                required : item.required,
                min : item.min,
                max : item.max,
            });
        });

        return modifierList;
    }

    async getOneModifier(modifierId: number, organizationId: string): Promise<ModifierReturnData> {
        
        const modifier = await this.modifierRepository.findModifierById(modifierId);
        if (!modifier || modifier.organization_id !== organizationId) throw new DataNotFound("Data not found");

        const modifierOptions = await this.modifierOptionRepository.findModifierOptionByModifier(modifier.modifier_id);
        const modifierOptionReturn : IModifierOption[] = modifierOptions.map(item => {
            return {
                // id : item.id,
                optionName : item.option_name,
                price : item.price,
            }
        });

        return {
            modifierId : modifier.modifier_id,
            name : modifier.name,
            modifierOptions : modifierOptionReturn,
            required : modifier.required,
            min : modifier.min,
            max : modifier.max,
        }
    }

    async createModifier(data: ICreateModifierData, organizationId: string, transaction?: Transaction): Promise<ModifierReturnData> {

        // check name exist
        const nameExist = await this.modifierRepository.findModifierByName(data.name, organizationId);
        if (nameExist) throw new ExistData("MODIFIER409-1");

        // check min is >= 1 if required true
        if (data.required && data.min == 0) {
            throw new NotValid("MODIFIER403-1");
        }

        // check max not more than options
        if (data.max > data.modifierOptions.length) {
            throw new NotValid("MODIFIER403-2");
        }

        // create modifier
        const createdModifier = await this.modifierRepository.createModifier({
            name : data.name,
            required : data.required,
            min : data.min,
            max : data.max,
            organization_id : organizationId,
        }, transaction);

        // create modifier option
        const modifierOptionList : Partial<ModifierOption>[] = [];
        data.modifierOptions.forEach(item => {
            modifierOptionList.push({
                modifier_id : createdModifier.modifier_id,
                option_name : item.optionName,
                price : item.price, 
            });
        });
        const createdModifierOptions = await this.modifierOptionRepository.bulkCreateModifierOption(modifierOptionList, transaction);
        const modifierOptionReturn = createdModifierOptions.map(item => {
            return {
                // id : item.id,
                optionName : item.option_name,
                price : item.price,
            }
        });

        return {
            modifierId : createdModifier.modifier_id,
            name : createdModifier.name,
            modifierOptions : modifierOptionReturn,
            required : createdModifier.required,
            min : createdModifier.min,
            max : createdModifier.max,
        }
    }

    async editModifier(data: IEditModifierData, organizationId: string, transaction?: Transaction): Promise<ModifierReturnData> {
        
        // check target exist
        const targetModifier = await this.modifierRepository.findModifierById(data.modifierId);
        if (!targetModifier || targetModifier.organization_id !== organizationId) throw new DataNotFound("Data not found");

        // check name exist
        const nameExist = await this.modifierRepository.findModifierByName(data.name, organizationId);
        if (nameExist && nameExist.modifier_id !== targetModifier.modifier_id) throw new ExistData("MODIFIER409-1");

        // check min is >= 1 if required true
        if (data.required && data.min == 0) {
            throw new NotValid("MODIFIER403-1");
        }

        // check max not more than options
        if (data.max > data.modifierOptions.length) {
            throw new NotValid("MODIFIER403-2");
        }

        // remove current modifierOption
        await this.modifierOptionRepository.destroyModifierOption(targetModifier.modifier_id, transaction);
        
        targetModifier.name = data.name;
        targetModifier.required = data.required;
        targetModifier.min = data.min;
        targetModifier.max = data.max;

        await targetModifier.save({ transaction });
        
        // create modifier option
        const modifierOptionList : Partial<ModifierOption>[] = [];
        data.modifierOptions.forEach(item => {
            modifierOptionList.push({
                modifier_id : targetModifier.modifier_id,
                option_name : item.optionName,
                price : item.price, 
            });
        });
        const createdModifierOptions = await this.modifierOptionRepository.bulkCreateModifierOption(modifierOptionList, transaction);
        const modifierOptionReturn = createdModifierOptions.map(item => {
            return {
                // id : item.id,
                optionName : item.option_name,
                price : item.price,
            }
        });

        return {
            modifierId : targetModifier.modifier_id,
            name : targetModifier.name,
            modifierOptions : modifierOptionReturn,
            required : targetModifier.required,
            min : targetModifier.min,
            max : targetModifier.max,
        }
    }

    async deleteModifier(modifierId: number, organizationId: string): Promise<boolean> {
        
        const targetModifier = await this.modifierRepository.findModifierById(modifierId);
        if (!targetModifier || targetModifier.organization_id !== organizationId) throw new DataNotFound("Data not found");

        targetModifier.archived = true;
        targetModifier.save();

        return true;
    }
}