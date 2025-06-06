import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { OneRoleData, RoleDataReturn } from "../models/roleInterface";



export class RoleApi {
    async getRoleList() : Promise<[undefined, RoleDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<RoleDataReturn[]>>(
            "role/"
        ));
        
        if (error) return [error];
        return [error, res.data.data];
    }

    async createRole(data : OneRoleData) : Promise<[undefined, OneRoleData] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<OneRoleData>>(
            "role/",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));
        
        if (error) return [error];
        return [error, res.data.data];
    }
}