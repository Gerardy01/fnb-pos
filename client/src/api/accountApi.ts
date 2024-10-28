import { axiosPrivate } from "../constants/axiosConfig";

// types and interfaces
import { FetchResponse } from "../models/globalInterface";
import { AccountInfoReturn, ChangePasswordBodyData } from "../models/accountInterface";


export class AccountApi {
    async getUserAccountInfo() : Promise<AccountInfoReturn> {
        const res = await axiosPrivate.get<FetchResponse<AccountInfoReturn>>(
            "account/action/user-info",
        );

        return res.data.data;
    }

    async changePassword(data : ChangePasswordBodyData) : Promise<boolean> {
        const res = await axiosPrivate.put<FetchResponse<boolean>>(
            "account/action/change-password",
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
            }
        )

        return res.data.data;
    }
}