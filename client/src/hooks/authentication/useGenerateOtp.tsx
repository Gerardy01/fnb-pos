import { useEffect, useState } from "react";
import { authApi } from "../../api"

import useNotification from "../useNotification";
import { useTranslation } from "react-i18next";



export default function useGenerateOtp() {

    const { t } = useTranslation(["global", "auth"]);

    const [address, setAddress] = useState<string>("");
    const [generateOtpLoad, setGenerateOtpLoad] = useState<boolean>(false);

    const [generateOtpCountdown, setGenerateOtpCountdown] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    const { errorNotification, successnotification } = useNotification();

    const generateOtpCode = async () => {
        if (!address) return;

        setGenerateOtpLoad(true);

        try {
            const [err] = await authApi.generateOtpCode({
                address : address
            });
    
            if (err) {
                errorNotification(t("auth:otpWrong"));
                return;
            }
            
            setGenerateOtpCountdown(30);

            const id = setInterval(() => {
                setGenerateOtpCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(id);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setIntervalId(id);
            successnotification(t("auth:otpGenerated"))
        } finally {
            setGenerateOtpLoad(false);
        }
    }

    const handleChangeAddress = (value : string) => {
        setAddress(value)
    }

    const restartCountdown = () => {
        setGenerateOtpCountdown(0);
        if (!intervalId) return;

        clearInterval(intervalId);
        setIntervalId(null);
    }

    return {
        generateOtpLoad,
        generateOtpCountdown,
        generateOtpCode,
        handleChangeAddress,
        restartCountdown,
    }
}