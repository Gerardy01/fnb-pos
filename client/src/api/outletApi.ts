import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { ChangeOutletStatusBodyData, ChangeOutletStatusDataReturn, CreateOutletBodyData, EditOutletBodyData, OutletDataReturn } from "../models/outletInterface";


export class OutletApi {
    async getAllOutlet(params? : string) : Promise<[undefined, OutletDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<OutletDataReturn[]>>(
            `outlet${params ? `?${params}` : ""}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneOutlet(outletId : string) : Promise<[undefined, OutletDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<OutletDataReturn>>(
            `outlet/${outletId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createOutlet(data : CreateOutletBodyData) : Promise<[undefined, OutletDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<OutletDataReturn>>(
            "outlet/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editOutlet(data : EditOutletBodyData) : Promise<[undefined, OutletDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<OutletDataReturn>>(
            "outlet/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async deleteOutlet(outletId : string) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `outlet/${outletId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async changeOutletStatus(data : ChangeOutletStatusBodyData) : Promise<[undefined, ChangeOutletStatusDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<ChangeOutletStatusDataReturn>>(
            "outlet/action/change-status",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}