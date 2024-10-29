import { useEffect, useState } from "react";

import { authApi } from "../../api";

import useCache from "../useCache";
import useStaticModal from "../useStaticModal";
import useToken from "../useToken";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// types and interfaces
import { LoginData } from "../../models/authInterface";

export default function useLogin() {

    const { t } = useTranslation('auth');

    const navigate = useNavigate();
    const { setRememberMeData, removeRememberMeData } = useCache();
    const { serverErrorModal, errorModal, warningModal } = useStaticModal();
    const { setAccessTokenValue, isLoggedIn } = useToken();

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

    const submitLogin = async ({ identifier, password, rememberMe } : LoginData) : Promise<void> => {
        setLoginLoad(true);

        try {
            const [err, data] = await authApi.login({
                identifier : identifier,
                password : password
            });
    
            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }
    
                if (err.status === 401) {
                    setErrorMessage(err.response.data.userMessage)
                    return;
                }
    
                if (err.status === 403) {
                    warningModal(t("organizationExpired"), t("organizationExpiredMsg"));
                    return;
                }
    
                serverErrorModal();
                return;
            }
    
            if (rememberMe) {
                setRememberMeData({
                    identifier : identifier,
                    password : password
                });
            }

            // set token into token state
            setAccessTokenValue(data.accessToken);
            navigate('/dashboard');

        } finally {
            setLoginLoad(false);

            if (!rememberMe) {
                removeRememberMeData();
            }
        }
    }


    return {
        loginLoad,
        errorMessage,
        submitLogin,
        pageLoading
    }
}