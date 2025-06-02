import { useEffect, useState } from "react"

import { accountApi } from "../../api";

import useStaticModal from "../useStaticModal";



export function useCheckUsernameAvailability(defaultUsername : string = "") {

    const { serverErrorModal } = useStaticModal();

    const [value, setValue] = useState<string>("");
    const [validated, setValidated]= useState<boolean | undefined>(undefined);
    const [onLoad, setOnLoad] = useState<boolean>(true);

    useEffect(() => {
        setOnLoad(true);
        const timeoutId = setTimeout(() => {
            setValidated(undefined);
            handleCheckUsernameExist();
            setOnLoad(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChangeValue = (value : string) => {
        setValue(value);
    }

    const clearValidated = () => {
        setValidated(undefined);
    }


    const handleCheckUsernameExist = async () => {
        if (!value) return;
        if (value.length > 20) return;
        if (value.length < 4) return;
        if (defaultUsername && value === defaultUsername) return;

        const pattern = /^[a-zA-Z0-9_]+$/;
        if (!pattern.test(value)) return;

        const [err, data] = await accountApi.checkAvailability({ username: value });
        if (err) {
            serverErrorModal();
            return;
        }

        if (!data.available) return setValidated(false);

        setValidated(true);
            
    }

    return {
        usernameCheckLoad : onLoad,
        usernameValidated : validated,
        handleChangeUsernameValue : handleChangeValue,
        clearUsernameValidated : clearValidated,
    }
}

export function useCheckEmailAvailability(defaultEmail : string = "") {

    const { serverErrorModal } = useStaticModal();

    const [value, setValue] = useState<string>("");
    const [validated, setValidated]= useState<boolean | undefined>(undefined);
    const [onLoad, setOnLoad] = useState<boolean>(true);

    useEffect(() => {
        setOnLoad(true);
        const timeoutId = setTimeout(() => {
            setValidated(undefined);
            handleCheckEmailExist();
            setOnLoad(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChangeValue = (value : string) => {
        setValue(value);
    }

    const clearValidated = () => {
        setValidated(undefined);
    }

    const handleCheckEmailExist = async () => {
        if (!value) return;
        if (value.length > 50) return;
        if (defaultEmail && value === defaultEmail) return;


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return;

        const [err, data] = await accountApi.checkAvailability({ email: value });

        if (err) {
            serverErrorModal();
            return;
        }

        if (!data.available) return setValidated(false);

        setValidated(true);
    }

    return {
        emailCheckLoad : onLoad,
        emailValidated : validated,
        handleChangeEmailValue : handleChangeValue,
        clearEmailalidated : clearValidated,
    }
}