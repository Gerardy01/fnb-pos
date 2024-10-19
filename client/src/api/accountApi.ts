import { axiosPrivate } from "../constants/axiosConfig";

// types and interfaces
import { FetchResponse } from "../models/globalInterface";
import { AccountInfoReturn } from "../models/accountInterface";


export class AccountApi {
    async getUserAccountInfo() : Promise<AccountInfoReturn> {
        const res = await axiosPrivate.get<FetchResponse<AccountInfoReturn>>(
            "account/action/user-info",
        );

        return res.data.data;
    }
}