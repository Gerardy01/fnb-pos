import { useState } from "react";

import { authApi } from "../api";



export default function useRefreshToken() {

    const [token, setToken] = useState<string>("");

    const isLoggedIn = async () : Promise<boolean> => {
        if (token) {
            return true;
        }
        
        try {
            const res = await authApi.getAccessToken();
            setToken(res.accessToken);
            return true;
        } catch {
            return false
        }
    }

    return {
        token,
        setToken,
        isLoggedIn,
    }
}