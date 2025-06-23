import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { ChangeTableGroupStatusBodyData, ChangeTableGroupStatusDataReturn, CreateTableBodyData, CreateTableGroupBodyData, EditTableGroupBodyData, TableDataReturn, TableGroupDataReturn } from "../models/tableInterface";


export class TableApi {
    async getAllTable(params? : string) : Promise<[undefined, TableDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<TableDataReturn[]>>(
            `table${params ? `?${params}` : ""}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async createTable(data : CreateTableBodyData) : Promise<[undefined, TableDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<TableDataReturn>>(
            "table/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getAllTableGroup(params? : string) : Promise<[undefined, TableGroupDataReturn[]] | [ErrorResponse]> {
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

    async deleteTableGroup(tableGroupId : number) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.delete<FetchResponse<boolean>>(
            `table-group/${tableGroupId}`
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async changeTableGroupStatus(data : ChangeTableGroupStatusBodyData) : Promise<[undefined, ChangeTableGroupStatusDataReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<ChangeTableGroupStatusDataReturn>>(
            "table-group/action/change-status",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}