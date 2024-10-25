import { useEffect, useState } from "react";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";



export default function usePermissionProtectedRoutes(requiredPermission : number[] ) {

    const userPermissions = useSelector((state : RootState) => state.userInfo.pageAccessPermissions);

    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    useEffect(() => {
        checkPermission();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requiredPermission]);

    const checkPermission = () => {
        const isExist = requiredPermission.every(permission => userPermissions.includes(permission));
        setIsAuthorized(isExist);
        if (!isExist) {
            window.location.href = "/dashboard"
        }

        setLoading(false);
    }

    return {
        loading,
        isAuthorized
    }
}