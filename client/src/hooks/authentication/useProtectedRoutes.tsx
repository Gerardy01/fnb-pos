import { useEffect, useState } from "react";

import useToken from "../useToken";
import useStaticModal from "../useStaticModal";
import { useNavigate } from "react-router-dom";

import { accountApi } from "../../api";

// redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/account/userInfoSlice";



export default function useProtectedRoutes() {

    const { isLoggedIn } = useToken();
    const { serverErrorModal } = useStaticModal();
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