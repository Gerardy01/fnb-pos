import { axiosPublic } from "../constants/axiosConfig";

// types and interfaces
import { FetchResponse } from "../models/globalInterface";
import { AuthData, AuthReturn } from "../models/authInterface";


export class AuthApi {
    async login(data : AuthData) : Promise<AuthReturn> {
        const res = await axiosPublic.post<FetchResponse<AuthReturn>>('/login', data);
        return res.data.data;
    }
}