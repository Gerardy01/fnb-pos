import { axiosPrivate, axiosPublic } from "../constants/axiosConfig";

import { catchFetchError } from "../utils/utility";

// types and interfaces
import { FetchResponse, ErrorResponse } from "../models/globalInterface";
import { AuthData, AuthReturn, GenerateOtpData, GenerateTokenAuthData } from "../models/authInterface";


export class AuthApi {
    async login(data : AuthData) : Promise<[undefined, AuthReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<AuthReturn>>(
            '/login',
            data,
            {
                headers : { 'Content-Type' : 'application/json' },
                withCredentials: true
            }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async logout() : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPrivate.post<FetchResponse<boolean>>('/logout'));

        if (error) return [error];
        return [error, true]
    }

    async logoutAllSession() :  Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<boolean>>("/logout-all"));

        if (error) return [error];
        return [error, res.data.data]
    }

    async getAccessToken() : Promise<[undefined, AuthReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.get<FetchResponse<AuthReturn>>(
            '/token',
            {
                withCredentials: true,
            }
        ));

        if (error) return [error];
        return [error, res.data.data]
    }

    async generateOtpCode(data : GenerateOtpData) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<boolean>>(
            '/otp-code',
            data
        ));

        if (error) return [error];
        return [error, res.data.data]
    }

    async generateTokenAuth(data : GenerateTokenAuthData) : Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<boolean>>(
            '/generate-token',
            data
        ));

        if (error) return [error];
        return [error, res.data.data]
    }
}