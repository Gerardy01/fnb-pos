import { useState } from "react";

import { authApi } from "../api";

import useCache from "./useCache";
import { useNavigate } from "react-router-dom";

// types and interfaces
import { LoginData } from "../models/authInterface";

export function useLogin() {

    const navigate = useNavigate();
    const { setRememberMeData, removeRememberMeData } = useCache();

    const [loginLoad, setLoginLoad] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const submitLogin = ({ identifier, password, rememberMe } : LoginData) : void => {
        setLoginLoad(true);
        
        authApi.login({
            identifier : identifier,
            password : password
        }).then(data => {

            if (rememberMe) {
                setRememberMeData({
                    identifier : identifier,
                    password : password
                });
            }

            // set token into token hooks state
            console.log(data.accessToken);

            navigate('/dashboard');

        }).catch(err => {

            console.log(err.response.data)

            if (err.status === 400) {

                return;
            }

            if (err.status === 401) {
                setErrorMessage(err.response.data.userMessage)
                return;
            }

            // handle 500 error

        }).finally(() => {
            setLoginLoad(false);

            if (!rememberMe) {
                removeRememberMeData();
            }
        });

    }


    return {
        loginLoad,
        errorMessage,
        submitLogin
    }
}