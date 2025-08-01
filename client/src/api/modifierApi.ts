import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { CreateModifierBodyData, EditModifierBodyData, ModifierDataReturn } from "../models/modifierInterface";



export class ModifierApi {
    async getAllModifier(params? : string) : Promise<[undefined, ModifierDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<ModifierDataReturn[]>>(
            `modifier${params ? `?${params}` : ""}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneModifier(modifierId : number) : Promise<[undefined, ModifierDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<ModifierDataReturn>>(
            `modifier/${modifierId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createModifier(data : CreateModifierBodyData) : Promise<[undefined, ModifierDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<ModifierDataReturn>>(
            "modifier/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editModifier(data : EditModifierBodyData) : Promise<[undefined, ModifierDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<ModifierDataReturn>>(
            "modifier/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteModifier(modifierId : number) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `modifier/${modifierId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}