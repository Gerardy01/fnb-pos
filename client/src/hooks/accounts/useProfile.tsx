import { useEffect, useState } from "react";

import { accountApi } from "../../api";

import useStaticModal from "../useStaticModal";
import { useTranslation } from "react-i18next";

// redux
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../redux/store"
import { setUserEmail, setUserName, setUserUsername } from "../../redux/account/userInfoSlice";

// types and interfaces
export type ChangeNameForm = {
    name : string;
}
export type ChangeUsernameForm = {
    username : string;
}

export type ChangeEmailForm = {
    email : string;
}



export function useChangeUsername() {

    const { serverErrorModal, errorModal } = useStaticModal();

    const dispatch = useDispatch();

    const { t } = useTranslation("account");

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const [changeUsernameValue, setChangeUsernameValue] = useState<string>(userInfo.username);
    const [checkUsernameLoad, setCheckUsernameLoad] = useState<boolean>(false);
    const [changeUsernameLoad, setChangeUsernameLoad] = useState<boolean>(false);
    const [validated, setValidated] = useState<boolean | undefined>(undefined);
    const [openChangeUsernameModal, setOpenChangeUsernameModal] = useState<boolean>(false);
    const [changeUsernameBtnDisabled, setChangeUsernameBtnDisabled] = useState<boolean>(true);
    const [changeUsernameErrorMsg, setChangeUsernameErrorMsg] = useState<string>("");

    useEffect(() => {
        setChangeUsernameBtnDisabled(true);
        setValidated(undefined);
        setChangeUsernameErrorMsg("");
        const timeoutId = setTimeout(() => {
            handleCheckUsernameExist();
        }, 1000);
      
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changeUsernameValue]);

    const handleChangeUsernameValue = (value : string) => {
        setChangeUsernameValue(value);
    }

    const handleOpenChangeUsername = (open : boolean) : void => {
        setOpenChangeUsernameModal(open);
    }

    const handleCheckUsernameExist = async () => {
        if (!changeUsernameValue) return;
        if (changeUsernameValue.length > 20) return;
        if (changeUsernameValue.length < 4) return;
        if (changeUsernameValue === userInfo.username) return;

        const pattern = /^[a-zA-Z0-9_]+$/;
        if (!pattern.test(changeUsernameValue)) return;

        setCheckUsernameLoad(true);

        try {
            const [err, data] = await accountApi.checkAvailability({ username: changeUsernameValue });

            if (err) {
                serverErrorModal();
                return;
            }

            if (!data.available) return setValidated(false);

            setValidated(true);
            setChangeUsernameBtnDisabled(false);

        } finally {
            setCheckUsernameLoad(false);
        }
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
            setChangeUsernameValue(res.newValue);
            setChangeUsernameBtnDisabled(true);

        } finally {
            setChangeUsernameLoad(false);
            setValidated(undefined);
        }
    }

    return {
        changeUsernameValue,
        openChangeUsernameModal,
        changeUsernameBtnDisabled,
        checkUsernameLoad,
        usernameValidated : validated,
        changeUsernameLoad,
        changeUsernameErrorMsg,
        handleChangeUsernameValue,
        handleOpenChangeUsername,
        handleChangeUsername,
    }
}


export function useChangeName() {

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const { serverErrorModal, errorModal } = useStaticModal();

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

    const dispatch = useDispatch();

    const userInfo = useSelector((state : RootState) => state.userInfo);
    const { t } = useTranslation("account");

    const [changeEmailValue, setChangeEmailValue] = useState<string>(userInfo.email);
    const [checkEmailLoad, setCheckEmailLoad] = useState<boolean>(false);
    const [changeEmailLoad, setChangeEmailLoad] = useState<boolean>(false);
    const [validated, setValidated] = useState<boolean | undefined>(undefined);
    const [openChangeEmailModal, setOpenChangeEmailModal] = useState<boolean>(false);
    const [changeEmailBtnDisabled, setChangeEmailBtnDisabled] = useState<boolean>(true);
    const [changeEmailErrorMsg, setChangeEmailErrorMsg] = useState<string>("");

    useEffect(() => {
        if (changeEmailValue) setChangeEmailBtnDisabled(true);
        if (!changeEmailValue) setChangeEmailBtnDisabled(false);
        setValidated(undefined);
        setChangeEmailErrorMsg("");
        const timeoutId = setTimeout(() => {
            handleCheckEmailExist();
        }, 1000)

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changeEmailValue]);

    const handleChangeEmailValue = (value : string) => {
        setChangeEmailValue(value);
    }

    const handleOpenChangeEmail = (open : boolean) : void => {
        setOpenChangeEmailModal(open);
    }

    const handleCheckEmailExist = async () => {
        if (!changeEmailValue) return;
        if (changeEmailValue.length > 50) return;
        if (changeEmailValue === userInfo.email) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(changeEmailValue)) return;

        setCheckEmailLoad(true);

        try {
            const [err, data] = await accountApi.checkAvailability({ email : changeEmailValue });

            if (err) {
                serverErrorModal();
                return;
            }

            if (!data.available) return setValidated(false);

            setValidated(true);
            setChangeEmailBtnDisabled(false);

        } finally {
            setCheckEmailLoad(false);
        }
    }

    const handleChangeEmail = async (data : ChangeEmailForm) => {
        
        setChangeEmailLoad(true);
        
        try {
            const [err, res] = await accountApi.editAccount({
                accountId: userInfo.accountId,
                process: "email",
                value: data.email
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
                    setChangeEmailErrorMsg(t(err.response.data.message))
                    return;
                }
    
                if (err.status === 422) {
                    setChangeEmailErrorMsg(t(err.response.data.message))
                    return;
                }
    
                serverErrorModal();
                return;
            }
    
            setOpenChangeEmailModal(false);
            dispatch(setUserEmail(res.newValue));
            setChangeEmailValue(res.newValue);
            setChangeEmailBtnDisabled(true);

        } finally {
            setChangeEmailLoad(false);
            setValidated(undefined);
        }
    }

    return {
        changeEmailValue,
        openChangeEmailModal,
        changeEmailBtnDisabled,
        checkEmailLoad,
        emailValidated : validated,
        changeEmailLoad,
        changeEmailErrorMsg,
        handleChangeEmailValue,
        handleOpenChangeEmail,
        handleChangeEmail,
    }

}

export default function useProfile() {

    const userInfo = useSelector((state : RootState) => state.userInfo);

    return {
        userInfo,
    }
}