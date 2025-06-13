import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { OutletDataReturn } from "../models/outletInterface";


export class OutletApi {
    async getAllOutlet() : Promise<[undefined, OutletDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<OutletDataReturn[]>>(
            "outlet/"
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}