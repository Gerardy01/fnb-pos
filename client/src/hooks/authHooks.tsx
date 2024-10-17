import { useEffect, useState } from "react";

import { authApi } from "../api";

import useCache from "./useCache";
import useStaticModal from "./useStaticModal";
import useRefreshToken from "./useRefreshToken";
import { useNavigate } from "react-router-dom";

// types and interfaces
import { LoginData } from "../models/authInterface";

export function useLogin() {

    const navigate = useNavigate();
    const { setRememberMeData, removeRememberMeData } = useCache();
    const { serverErrorModal, errorModal } = useStaticModal();
    const { setToken, isLoggedIn } = useRefreshToken();

    const [loginLoad, setLoginLoad] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [pageLoading, setPageLoading] = useState<boolean>(true);


    useEffect(() => {
        checkLoggedIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkLoggedIn = async () => {
        const loggedIn = await isLoggedIn();

        if (!loggedIn) {
            setPageLoading(false);
            return;
        }

        navigate("/dashboard");
    }

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
            setToken(data.accessToken);

            navigate('/dashboard');

        }).catch(err => {

            if (err.status === 400) {
                const error = err.response.data.errors[0]
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            if (err.status === 401) {
                setErrorMessage(err.response.data.userMessage)
                return;
            }

            serverErrorModal();

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
        submitLogin,
        pageLoading
    }
}

export function useProtectedRoutes() {

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const { isLoggedIn } = useRefreshToken();
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkLoggedIn = async () => {
        const loggedInResult = await isLoggedIn();

        if (loggedInResult) {
            setPageLoading(false);
            setLoggedIn(true);
            return;
        }

        navigate("/login");
    }

    return {
        pageLoading,
        loggedIn
    }
}