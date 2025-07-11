import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { CreateSalesTypeBodyData, EditSalesTypeBodyData, SalesTypeCompleteDataReturn, SalesTypeReturnData } from "../models/salesTypeInterface";


export class SalesTypeApi {
    async getAllSalesType() : Promise<[undefined, SalesTypeReturnData[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<SalesTypeReturnData[]>>(
            "sales-type"
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getAllSalesTypeComplete() : Promise<[undefined, SalesTypeCompleteDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<SalesTypeCompleteDataReturn[]>>(
            "sales-type/action/complete"
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneSalesType(salesTypeId : number) : Promise<[undefined, SalesTypeCompleteDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<SalesTypeCompleteDataReturn>>(
            `sales-type/${salesTypeId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createSalesType(data : CreateSalesTypeBodyData) : Promise<[undefined, SalesTypeCompleteDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<SalesTypeCompleteDataReturn>>(
            "sales-type/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editSalesType(data : EditSalesTypeBodyData) : Promise<[undefined, SalesTypeCompleteDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<SalesTypeCompleteDataReturn>>(
            "sales-type/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteSalesType(salesTypeId : number) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `sales-type/${salesTypeId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}