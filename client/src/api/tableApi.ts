import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { CreateTableGroupBodyData, EditTableGroupBodyData, TableGroupDataReturn } from "../models/tableInterface";


export class TableApi {
    async getAllTableGroup(params : string) : Promise<[undefined, TableGroupDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<TableGroupDataReturn[]>>(
            `table-group${params ? `?${params}` : ""}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getOneTableGroup(tableGroupId : number) : Promise<[undefined, TableGroupDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<TableGroupDataReturn>>(
            `table-group/${tableGroupId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createTableGroup(data : CreateTableGroupBodyData) : Promise<[undefined, TableGroupDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<TableGroupDataReturn>>(
            "table-group/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async editTableGroup(data : EditTableGroupBodyData) : Promise<[undefined, TableGroupDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<TableGroupDataReturn>>(
            "table-group/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}