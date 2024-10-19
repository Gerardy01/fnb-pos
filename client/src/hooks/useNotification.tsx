import { notification } from "antd"

import { useTranslation } from 'react-i18next';


export default function useNotification() {

    const { t } = useTranslation("global");
    
    const successnotification = (title? : string, content? : string) : void => {
        notification.success({
            message : title ? title : t("success"),
            description : content
        });
    }

    const infoNotification = (title? : string, content? : string) : void => {
        notification.error({
            message : title ? title : t("information"),
            description : content,
            showProgress : true
        });
    }

    const warningNotification = (title? : string, content? : string) : void => {
        notification.warning({
            message : title ? title : t("warning"),
            description : content
        });
    }

    const errorNotification = (title? : string, content? : string) : void => {
        notification.error({
            message : title ? title : t("error"),
            description : content
        });
    }

    return {
        successnotification,
        infoNotification,
        warningNotification,
        errorNotification,
    }
}