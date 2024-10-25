import { Outlet } from "react-router-dom";

import useProtectedRoutes from "../../hooks/authentication/useProtectedRoutes";

// componetns
import PageLoading from "../loading/PageLoading";



export default function ProtectedRoutes() {

    const { pageLoading, loggedIn } = useProtectedRoutes();

    if (pageLoading) {
        return (
            <PageLoading />
        )
    }

    return !pageLoading && loggedIn ? (
        <Outlet />
    ) : <></>
}