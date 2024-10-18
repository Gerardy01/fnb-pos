import { Outlet } from "react-router-dom";

import useProtectedRoutes from "../../hooks/authentication/useProtectedRoutes";




export default function ProtectedRoutes() {

    const { pageLoading, loggedIn } = useProtectedRoutes();

    if (pageLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return !pageLoading && loggedIn ? (
        <Outlet />
    ) : <></>
}