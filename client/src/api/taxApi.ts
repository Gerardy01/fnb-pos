import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { CreateTaxBodyData, EditTaxBodyData, TaxCompleteDataReturn, TaxDataReturn } from "../models/taxInterface";



export class TaxApi {
    async getAllTax() : Promise<[undefined, TaxDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<TaxDataReturn[]>>(
            "tax"
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getAllTaxComplete() : Promise<[undefined, TaxCompleteDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<TaxCompleteDataReturn[]>>(
            "tax/action/complete"
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneTax(taxId : number) : Promise<[undefined, TaxCompleteDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<TaxCompleteDataReturn>>(
            `tax/${taxId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createTax(data : CreateTaxBodyData) : Promise<[undefined, TaxCompleteDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<TaxCompleteDataReturn>>(
            "tax/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editTax(data : EditTaxBodyData) : Promise<[undefined, TaxCompleteDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<TaxCompleteDataReturn>>(
            "tax/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteTax(taxId : number) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `tax/${taxId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}