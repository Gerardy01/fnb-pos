
// types and interfaces
import { AuthData } from "../models/authInterface"



export default function useCache() {
    
    const setRememberMeData = (data : AuthData) : void => {
        localStorage.setItem('loginCreds', JSON.stringify(data));
    }

    const getRememberMeData = () : AuthData => {
        const storedData = localStorage.getItem('loginCreds');
        const parsedData = storedData ? JSON.parse(storedData) : null;

        const identifier = parsedData ? parsedData.identifier : "";
        const password = parsedData ? parsedData.password : "";

        return {
            identifier : identifier,
            password : password
        }
    }

    const removeRememberMeData = () : void => {
        localStorage.removeItem('loginCreds');
    }

    return {
        setRememberMeData,
        getRememberMeData,
        removeRememberMeData,
    }
}