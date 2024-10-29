import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import useStaticModal from '../useStaticModal';
import { useTranslation } from 'react-i18next';

import { accountApi, authApi } from '../../api';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeAccessToken } from '../../redux/authentication/tokenSlice';

// types and interfaces
import { ChangePasswordData } from '../../models/accountInterface';



export default function useChangePassword() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { confirmationModal, serverErrorModal, errorModal } = useStaticModal();

    const { t } = useTranslation(["account", "global"]);

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const [wrongPassMsg, setWrongPassMsg] = useState<string>("");
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);

    const handleClickBack = () => {
        confirmationModal({
            title : t("global:exitPage"),
            content: t("account:passwordNotChanged"),
            okBtn: t("global:leave"),
            cancelBtn: t("global:stay"),
            okBtnDanger: true,
            onOk : () => navigate(-1),
        });
    }

    const handleLogout = async () : Promise<void> => {
        const [err] = await authApi.logoutAllSession()

        if (err) {
            serverErrorModal();
            return;
        }

        dispatch(removeAccessToken());
        navigate("/login");
    }

    const handleSubmit = async (data : ChangePasswordData) => {
        setWrongPassMsg("");
        setSubmitLoad(true);

        try {
            const [err] = await accountApi.changePassword({
                currentPassword: data.oldPassword,
                newPassword: data.newPassword
            });

            if (err) {

                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 403) {
                    setWrongPassMsg(t(`account:${err.response.data.userMessage}`));
                    return;
                }
    
                if (err.status === 422) {
                    errorModal(
                        t(`account:wrongPassFormat`),
                        t(`account:${err.response.data.userMessage}`)
                    );
                    return;
                }

                serverErrorModal();
                return;
            }

            confirmationModal({
                title: t("account:passwordChanged"),
                content: t("account:passwordChangedAskLogout"),
                okBtn: t("global:yes"),
                cancelBtn: t("global:no"),
                centered: true,
                onOkWithPromise : handleLogout
            });

            navigate(-1);

        } finally {
            setSubmitLoad(false);
        }   
    }

    return {
        userInfo,
        submitLoad,
        wrongPassMsg,
        handleSubmit,
        handleClickBack,
    }
}