import { useEffect, useState } from "react";

import useToken from "../useToken";
import { useNavigate } from "react-router-dom";



export default function useProtectedRoutes() {

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const { isLoggedIn } = useToken();
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