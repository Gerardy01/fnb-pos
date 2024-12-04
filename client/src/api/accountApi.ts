import { axiosPrivate } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { AccountDataReturn, AccountInfoReturn, ChangePasswordBodyData, CheckAvailabilityQueryParams, CheckAvailabilityReturn, EditAccountBodyData, EditAccountReturn } from "../models/accountInterface";


export class AccountApi {
    async getAllAccount() : Promise<[undefined, AccountDataReturn[]] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<AccountDataReturn[]>>(
            "account/"
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getUserAccountInfo() : Promise<[undefined, AccountInfoReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<AccountInfoReturn>>(
            "account/action/user-info",
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async checkAvailability({
        username = undefined,
        email = undefined,
    } : CheckAvailabilityQueryParams) : Promise<[undefined, CheckAvailabilityReturn] | [ErrorResponse]> {

        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<CheckAvailabilityReturn>>(
            "account/action/check-availability",
            {
                params: {
                    username : username,
                    email : email
                },             
            }
        ));


        if (error) return [error];
        return [error, res.data.data]
    }

    async editAccount(data : EditAccountBodyData) : Promise<[undefined, EditAccountReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<EditAccountReturn>>(
            "account",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data]
    }

    async changePassword(data : ChangePasswordBodyData) : Promise<[undefined, boolean] | [ErrorResponse]> {

        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<boolean>>(
            "account/action/change-password",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}