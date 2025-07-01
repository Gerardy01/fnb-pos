import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { CreateGratuityBodyData, GratuityDataReturn } from "../models/gratuityInterface";


export class GratuityApi {
    async getAllGratuity(params? : string) : Promise<[undefined, GratuityDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<GratuityDataReturn[]>>(
            `gratuity${params ? `?${params}` : ""}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createGratuity(data : CreateGratuityBodyData) : Promise<[undefined, GratuityDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<GratuityDataReturn>>(
            "gratuity/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}