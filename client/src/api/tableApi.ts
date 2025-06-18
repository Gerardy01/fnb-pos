import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { TableGroupDataReturn } from "../models/tableInterface";


export class TableApi {
    async getAllTableGroup(params : string) : Promise<[undefined, TableGroupDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<TableGroupDataReturn[]>>(
            `table-group${params ? `?${params}` : ""}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}