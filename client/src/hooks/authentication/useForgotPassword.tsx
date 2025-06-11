import { useEffect, useState } from "react"
import { FormProps } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import useToken from "../useToken";
import useStaticModal from "../useStaticModal";
import { useTranslation } from "react-i18next";

import { accountApi, authApi } from "../../api";


// types and interfaces
interface ResetInstructionForm {
    email : string;
}
interface ChangePasswordForm {
    newPassword : string;
}



export function useForgotPassword() {

    const navigate = useNavigate();

    const { t } = useTranslation(['auth', 'account']);

    const { isLoggedIn } = useToken(); 
    const { serverErrorModal } = useStaticModal();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [notAdmin, setNotAdmin] = useState<boolean>(false);
    const [generated, setGenerated] = useState<boolean>(false);

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

    const handleSendResetInstruction : FormProps<ResetInstructionForm>['onFinish'] = async (values) : Promise<void> => {
        
        setLoading(true);

        try {
            const [err] = await authApi.generateTokenAuth({
                email : values.email
            });
    
            if (err) {

                if (err.status === 404) {
                    setErrorMessage(t("account:ACCOUNT404"));
                    return;
                }

                if (err.status === 403) {
                    setNotAdmin(true);
                    return;
                }

                serverErrorModal();
                return;
            }

            setGenerated(true);

        } finally {
            setLoading(false);
        }
    }

    return {
        errorMessage,
        loading,
        pageLoading,
        notAdmin,
        generated,
        handleSendResetInstruction
    }
}

export function useForgotPasswordChange() {

    const navigate = useNavigate();
    const location = useLocation();

    const { isLoggedIn } = useToken();
    const { serverErrorModal } = useStaticModal();

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [passChanged, setPassChanged] = useState<boolean>(false);

    const searchParams = new URLSearchParams(location.search);
    const token : string | null = searchParams.get("token");

    useEffect(() => {
        checkLoggedIn();
        if (!token) navigate("/login");

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

    const handleChangePass : FormProps<ChangePasswordForm>['onFinish'] = async (values) : Promise<void> => {
        setLoading(true);

        try {

            const [err] = await accountApi.forgotPassChange({
                newPassword : values.newPassword,
                token : token ? token : ""
            });

            if (err) {
                serverErrorModal();
                if (err.status === 500) return;

                navigate("/forgot-password");
                return;
            }

            setPassChanged(true);

        } finally {
            setLoading(false);
        }
    }

    return {
        pageLoading,
        loading,
        passChanged,
        handleChangePass,
    }
}