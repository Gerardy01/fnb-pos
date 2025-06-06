import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// tpyes and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { PermissionData, PageAccessPermissionData } from "../models/permissionInterface";

export class PermissionApi {
    async getAllPermission() : Promise<[undefined, PermissionData[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<PermissionData[]>>(
            "permission/"
        ));
        
        if (error) return [error];
        return [error, res.data.data];
    }

    async getAllPageAccessPermission() : Promise<[undefined, PageAccessPermissionData[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<PageAccessPermissionData[]>>(
            "permission/page-access-permission-list"
        ));
        
        if (error) return [error];
        return [error, res.data.data];
    }
}