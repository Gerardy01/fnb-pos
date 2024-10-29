import { useEffect, useState } from "react";

import useToken from "../useToken";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useNavigate } from "react-router-dom";

import { accountApi, organizationApi } from "../../api";

import { useTranslation } from 'react-i18next';

// redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/account/userInfoSlice";
import { setOrganizationInfo } from "../../redux/organization/organizationSlice";



export default function useProtectedRoutes() {

    const { t } = useTranslation(["account", "global"]);

    const { isLoggedIn } = useToken();
    const { serverErrorModal } = useStaticModal();
    const { errorNotification } = useNotification();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInfoFetchLoad, setUserInfoFetchLoad] = useState<boolean>(true);
    const [organizationInfoFetchLoad, setOrganizationinfoFetchLoad] = useState<boolean>(true);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        checkLoggedIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (userInfoFetchLoad || organizationInfoFetchLoad) return;
        setPageLoading(false);
    }, [userInfoFetchLoad, organizationInfoFetchLoad]);

    const checkLoggedIn = async () => {
        const loggedInResult = await isLoggedIn();

        if (!loggedInResult) return navigate("/login");

        setLoggedIn(true);
        getAccountInfo();
        getOrganizationInfo();
    }

    const getAccountInfo = async () => {
        try {
            const [err, res] = await accountApi.getUserAccountInfo();

            if (err) {
                if (err.status === 404) {
                    const error = err.response.data;
                    errorNotification(t("global:wentWrong"), t(`account:${error.userMessage}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            dispatch(setUserInfo(res));

        } finally {
            setUserInfoFetchLoad(false);
        }
    }

    const getOrganizationInfo = async () => {

        try {
            const [err, res] = await organizationApi.getUserOrganizationInfo();

            if (err) {
                if (err.status === 404) {
                    const error = err.response.data;
                    errorNotification(t("global:wentWrong"), t(`account:${error.userMessage}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            dispatch(setOrganizationInfo(res));

        } finally {
            setOrganizationinfoFetchLoad(false);
        }
    }

    return {
        pageLoading,
        loggedIn
    }
}