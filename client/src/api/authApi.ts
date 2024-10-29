import { axiosPrivate, axiosPublic } from "../constants/axiosConfig";

// types and interfaces
import { FetchResponse } from "../models/globalInterface";
import { AuthData, AuthReturn } from "../models/authInterface";


export class AuthApi {
    async login(data : AuthData) : Promise<AuthReturn> {
        const res = await axiosPublic.post<FetchResponse<AuthReturn>>(
            '/login',
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
                withCredentials: true
            }
        );
        
        return res.data.data;
    }

    async logout() : Promise<void> {
        await axiosPrivate.post('/logout');
    }

    async logoutAllSession() : Promise<boolean> {
        const res = await axiosPrivate.post<FetchResponse<boolean>>("/logout-all");
        return res.data.data;
    }

    async getAccessToken() : Promise<AuthReturn> {
        const res = await axiosPublic.get<FetchResponse<AuthReturn>>(
            '/token',
            {
                withCredentials: true,
            }
        );

        return res.data.data;
    }
}