import { useEffect, useState } from "react";
import { Form } from "antd";

import { accountApi } from "../../api";

import useStaticModal from "../useStaticModal";
import { useTranslation } from "react-i18next";

// redux
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../redux/store"
import { setUserEmail, setUserName, setUserUsername } from "../../redux/account/userInfoSlice";
import useNotification from "../useNotification";

// types and interfaces
export type ChangeNameForm = {
    name : string;
}
export type ChangeUsernameForm = {
    username : string;
}

export type ChangeEmailForm = {
    email : string;
    otpCode : string;
}



export function useChangeUsername() {

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const dispatch = useDispatch();

    const { t } = useTranslation("account");

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const [changeUsernameLoad, setChangeUsernameLoad] = useState<boolean>(false);
    const [openChangeUsernameModal, setOpenChangeUsernameModal] = useState<boolean>(false);
    const [changeUsernameErrorMsg, setChangeUsernameErrorMsg] = useState<string>("");

    const handleOpenChangeUsername = (open : boolean) : void => {
        setOpenChangeUsernameModal(open);
    }

    const handleChangeUsername = async (data : ChangeUsernameForm) => {
        
        setChangeUsernameLoad(true);

        try {

            const [err, res] = await accountApi.editAccount({
                accountId: userInfo.accountId,
                process: "username",
                value: data.username
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }
    
                if (err.status === 409) {
                    setChangeUsernameErrorMsg(t(err.response.data.message));
                    return;
                }
    
                if (err.status === 403) {
                    setChangeUsernameErrorMsg(t(err.response.data.message));
                    return;
                }
    
                if (err.status === 422) {
                    setChangeUsernameErrorMsg(t(err.response.data.message));
                    return;
                }
    
                serverErrorModal();
                return;
            }

            dispatch(setUserUsername(res.newValue));
            setOpenChangeUsernameModal(false);

            successnotification(t("account:changeNameSuccess"));

        } finally {
            setChangeUsernameLoad(false);
        }
    }

    return {
        openChangeUsernameModal,
        changeUsernameLoad,
        changeUsernameErrorMsg,
        handleOpenChangeUsername,
        handleChangeUsername,
    }
}


export function useChangeName() {

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const dispatch = useDispatch();

    const { t } = useTranslation("account");

    const [changeNameValue, setChangeNameValue] = useState<string>(userInfo.name);
    const [changeNameLoad, setChangeNameLoad] = useState<boolean>(false);
    const [openChangeNameModal, setOpenChangeNameModal] = useState<boolean>(false);
    const [changeNameBtnDisabled, setChangeNameBtnDisabled] = useState<boolean>(false);

    useEffect(() => {
        checkChangeNameBtnDisabled();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changeNameValue]);

    const handleSetChangeNameValue = (value : string) => {
        setChangeNameValue(value);
    }

    const handleOpenChangeName = (open : boolean) : void => {
        setOpenChangeNameModal(open);
    }

    const checkChangeNameBtnDisabled = () => {
        if (!changeNameValue) return setChangeNameBtnDisabled(true);
        if (changeNameValue === userInfo.name) {
            setChangeNameBtnDisabled(true);
            return;
        }

        setChangeNameBtnDisabled(false);
    }

    const handleChangeName = async (data : ChangeNameForm) : Promise<void> => {
        
        setChangeNameLoad(true);

        try {
            const [err, res] = await accountApi.editAccount({
                accountId: userInfo.accountId,
                process: "name",
                value: data.name
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }
    
                if (err.status === 409) {
                    errorModal(undefined, t(err.response.data.message));
                    return;
                }
    
                if (err.status === 403) {
                    errorModal(undefined, t(err.response.data.message));
                    return;
                }
    
                if (err.status === 422) {
                    errorModal(undefined, t(err.response.data.message));
                    return;
                }
    
                serverErrorModal();
                return;
            }

            setChangeNameValue(res.newValue);
            dispatch(setUserName(res.newValue));
            setOpenChangeNameModal(false);
            setChangeNameBtnDisabled(true);

            successnotification(t("account:changeNameSuccess"));
            
        } finally {
            setChangeNameLoad(false);
        }
    }

    return {
        openChangeNameModal,
        changeNameValue,
        changeNameBtnDisabled,
        changeNameLoad,
        handleSetChangeNameValue,
        handleOpenChangeName,
        handleChangeName
    }
}

export function useChangeEmail() {

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const dispatch = useDispatch();

    const userInfo = useSelector((state : RootState) => state.userInfo);
    const { t } = useTranslation("account");

    const [changeEmailForm] = Form.useForm();

    const [changeEmailLoad, setChangeEmailLoad] = useState<boolean>(false);
    const [openChangeEmailModal, setOpenChangeEmailModal] = useState<boolean>(false);
    const [changeEmailErrorMsg, setChangeEmailErrorMsg] = useState<string>("");

    const [changeEmailStep, setChangeEmailStep] = useState<number>(0);

    const handleOpenChangeEmail = (open : boolean) : void => {
        setOpenChangeEmailModal(open);

        if (!open) {
            handleChangeEmailStep(0);
            changeEmailForm.resetFields();
        }
    }

    const handleChangeEmail = async (data : ChangeEmailForm) => {
        
        setChangeEmailLoad(true);
        
        try {
            const [err, res] = await accountApi.editAccount({
                accountId: userInfo.accountId,
                process: "email",
                value: data.email,
                otpCode: Number(data.otpCode),
            });
    
            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }
    
                if (err.status === 409) {
                    setChangeEmailErrorMsg(t(err.response.data.message))
                    return;
                }
    
                if (err.status === 403) {
                    errorModal(t('global:failed'), t(`account:${err.response.data.message}`));
                    return;
                }
    
                if (err.status === 422) {
                    setChangeEmailErrorMsg(t(err.response.data.message))
                    return;
                }
    
                serverErrorModal();
                return;
            }
    
            handleOpenChangeEmail(false);
            successnotification(t("account:changeEmailSuccess"));

            dispatch(setUserEmail(res.newValue));

        } finally {
            setChangeEmailLoad(false);
        }
    }

    const handleChangeEmailStep = (step: number) : void => {
        setChangeEmailStep(step);
    } 

    return {
        changeEmailForm,
        openChangeEmailModal,
        changeEmailLoad,
        changeEmailErrorMsg,
        changeEmailStep,
        handleOpenChangeEmail,
        handleChangeEmail,
        handleChangeEmailStep,
    }

}

export default function useProfile() {

    const userInfo = useSelector((state : RootState) => state.userInfo);

    return {
        userInfo,
    }
}