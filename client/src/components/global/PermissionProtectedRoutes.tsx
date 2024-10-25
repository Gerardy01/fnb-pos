import { Outlet } from "react-router-dom";

// components
import ContentLoading from "../loading/ContentLoading";
import PageLoading from "../loading/PageLoading";
import usePermissionProtectedRoutes from "../../hooks/global/usePermissionProtectedRoutes";

// types and interfaces
interface Props {
    requiredPermission: number[];
    pageLoad?: boolean
}

export default function PermissionProtectedRoutes({ requiredPermission, pageLoad=false } : Props) {

    const { loading, isAuthorized } = usePermissionProtectedRoutes(requiredPermission);

    if (loading || !isAuthorized) {
        return pageLoad ? <PageLoading /> : <ContentLoading />
    }

    return !loading && isAuthorized ? <Outlet /> : <></>
}