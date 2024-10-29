import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { OrganizationInfoReturn } from "../models/organizationInterface";


export class OrganizationApi {
    async getUserOrganizationInfo() : Promise<[undefined, OrganizationInfoReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<OrganizationInfoReturn>>(
            "organization/action/organization-info",
        ));
        
        if (error) return [error];
        return [error, res.data.data];
    }
}