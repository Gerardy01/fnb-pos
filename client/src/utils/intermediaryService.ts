
// redux
import { store } from "../redux/store";
import { setAccessToken } from "../redux/authentication/tokenSlice"; 


export function getAccessToken() : string {
    return store.getState().token.accessToken;
}

export function storeAccessToken(token : string) : void {
    store.dispatch(setAccessToken(token));
}