import { axiosPrivate } from "../constants/axiosConfig";

// types and interfaces
import { FetchResponse } from "../models/globalInterface";
import { OrganizationInfoReturn } from "../models/organizationInterface";


export class OrganizationApi {
    async getUserOrganizationInfo() : Promise<OrganizationInfoReturn> {
        const res = await axiosPrivate.get<FetchResponse<OrganizationInfoReturn>>(
            "organization/action/organization-info",
        );

        return res.data.data;
    }
}