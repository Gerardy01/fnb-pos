import { useEffect, useState } from "react";

import { accountApi } from "../../api";

import useStaticModal from "../useStaticModal";

// redux
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

// types and interfaces
export type ChangeNmaeForm = {
    name : string;
}
export type ChangeUsernameForm = {
    username : string;
}



export function useChangeUsername() {

    const { serverErrorModal } = useStaticModal();

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const [changeUsernameValue, setChangeUsernameValue] = useState<string>(userInfo.username);
    const [checkUsernameLoad, setCheckUsernameLoad] = useState<boolean>(false);
    const [validated, setValidated] = useState<boolean | undefined>(undefined);
    const [openChangeUsernameModal, setOpenChangeUsernameModal] = useState<boolean>(false);
    const [changeUsernameBtnDisabled, setChangeUsernameBtnDisabled] = useState<boolean>(true);

    useEffect(() => {
        setChangeUsernameBtnDisabled(true);
        setValidated(undefined);
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

            if (data.available) {
                setValidated(true);
                setChangeUsernameBtnDisabled(false);
            } else {
                setValidated(false);
            }

        } finally {
            setCheckUsernameLoad(false);
        }
    }

    const handleChangeUsername = (data : ChangeUsernameForm) => {
        console.log(data);
    }

    return {
        changeUsernameValue,
        openChangeUsernameModal,
        changeUsernameBtnDisabled,
        checkUsernameLoad,
        usernameValidated : validated,
        handleChangeUsernameValue,
        handleOpenChangeUsername,
        handleChangeUsername,
    }
}


export function useChangeName() {

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const [changeNameValue, setChangeNameValue] = useState<string>(userInfo.name);
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

    const handleChangeName = (data : ChangeNmaeForm) : void => {
        if (data.name === userInfo.name) {
            setOpenChangeNameModal(false);
            return;
        }

        console.log(data.name)
    }

    return {
        openChangeNameModal,
        changeNameValue,
        changeNameBtnDisabled,
        handleSetChangeNameValue,
        handleOpenChangeName,
        handleChangeName
    }
}

export default function useProfile() {

    const userInfo = useSelector((state : RootState) => state.userInfo);

    return {
        userInfo,
    }
}