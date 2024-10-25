import { authApi } from "../api";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "../redux/authentication/tokenSlice";
import { RootState } from "../redux/store";



export default function useToken() {

    const dispatch = useDispatch();
    
    const accessToken = useSelector((state : RootState) => state.token.accessToken);

    const isLoggedIn = async () : Promise<boolean> => {
        if (accessToken) return true;
        
        try {
            const res = await authApi.getAccessToken();
            dispatch(setAccessToken(res.accessToken));
            return true;
        } catch {
            return false
        }
    }

    const setAccessTokenValue = (value : string) => {
        dispatch(setAccessToken(value));
    }

    return {
        accessToken,
        setAccessTokenValue,
        isLoggedIn,
    }
}