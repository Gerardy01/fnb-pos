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
        
        const [err, res] = await authApi.getAccessToken();

        if (err) return false;

        dispatch(setAccessToken(res.accessToken));
        return true;
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