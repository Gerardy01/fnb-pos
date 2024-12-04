import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { RoleDataReturn } from "../models/roleInterface";



export class RoleApi {
    async getRoleList() : Promise<[undefined, RoleDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<RoleDataReturn[]>>(
            "role/"
        ));
        
        if (error) return [error];
        return [error, res.data.data];
    }
}