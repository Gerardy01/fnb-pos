import { useEffect, useState } from "react";

import useToken from "../useToken";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useNavigate } from "react-router-dom";

import { accountApi } from "../../api";

import { useTranslation } from 'react-i18next';

// redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/account/userInfoSlice";



export default function useProtectedRoutes() {

    const { t } = useTranslation(["account", "global"]);

    const { isLoggedIn } = useToken();
    const { serverErrorModal } = useStaticModal();
    const { errorNotification } = useNotification();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        checkLoggedIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkLoggedIn = async () => {
        const loggedInResult = await isLoggedIn();

        if (!loggedInResult) return navigate("/login");

        setLoggedIn(true);
        getAccountInfo();
    }

    const getAccountInfo = () => {
        accountApi.getUserAccountInfo().then(res => {
            dispatch(setUserInfo(res));
        }).catch(err => {

            if (err.status === 404) {
                const error = err.response.data;
                errorNotification(t("global:wentWrong"), t(`account:${error.userMessage}`));
                return;
            }

            serverErrorModal();

        }).finally(() => {
            setPageLoading(false);
        })
    }

    return {
        pageLoading,
        loggedIn
    }
}