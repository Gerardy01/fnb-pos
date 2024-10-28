import { Modal, Typography } from "antd";
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";

// types and interfaces
interface ConfirmationModalParams {
    title : string,
    content : string,
    onOk? : () => void,
    onCancel? : () => void,
    okBtn? : string,
    cancelBtn? : string,
    centered? : boolean,
    okBtnDanger? : boolean,
}

const { Title, Text } = Typography;

export default function useStaticModal() {

    const { t } = useTranslation("global");

    const successModal = (
        title? : string,
        content? : string,
        okText? : string,
    ) : void => {
        Modal.success({
            centered : true,
            content: (
                <div style={styles.container}>
                    <CheckCircleOutlined size={150} style={{...styles.icon, ...styles.success}} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("success")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            width: '300px',
            okText: okText ? okText : t("close"),
            icon: null,
            okButtonProps: {
                style: {...styles.okButton, ...styles.successBtn}
            }
        });
    }

    const infoModal = (
        title? : string,
        content? : string,
        okText? : string,
    ) : void => {
        Modal.info({
            centered : true,
            content: (
                <div style={styles.container}>
                    <InfoCircleOutlined  size={150} style={{...styles.icon, ...styles.info}} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("information")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            width: '300px',
            okText: okText ? okText : t("close"),
            icon: null,
            okButtonProps: {
                style: {...styles.okButton, ...styles.infoBtn}
            }
        });
    }

    const warningModal = (
        title? : string,
        content? : string,
        okText? : string,
    ) : void => {
        Modal.warning({
            centered : true,
            content: (
                <div style={styles.container}>
                    <WarningOutlined size={150} style={{...styles.icon, ...styles.warning}} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("warning")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            width: '320px',
            okText: okText ? okText : t("close"),
            icon: null,
            okButtonProps: {
                style: {...styles.okButton, ...styles.warningBtn}
            }
        });
    }

    const errorModal = (
        title? : string,
        content? : string,
        okText? : string,
    ) : void => {
        Modal.error({
            centered : true,
            content: (
                <div style={styles.container}>
                    <CloseCircleOutlined size={150} style={{...styles.icon, ...styles.error}} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{title ? title : t("error")}</Title>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>
                </div>
            ),
            width: '300px',
            okText: okText ? okText : t("close"),
            icon: null,
            okButtonProps: {
                style: {...styles.okButton, ...styles.errorBtn}
            }
        });
    }

    const serverErrorModal = () : void => {
        Modal.warning({
            centered : true,
            content: (
                <div style={styles.container}>
                    <WarningOutlined size={150} style={{...styles.icon, ...styles.warning}} />
                    <Title
                        level={4}
                        style={styles.titleText}
                    >{t("wentWrong")}</Title>
                    <Text
                        style={styles.contentText}
                    >{t("unexpectedError")}</Text>
                </div>
            ),
            width: '320px',
            okText: t("goBack"),
            icon: null,
            okButtonProps: {
                style: {...styles.okButton, ...styles.warningBtn}
            }
        });
    }

    const confirmationModal = ({
        title,
        content,
        okBtn,
        cancelBtn,
        centered,
        okBtnDanger,
        onOk,
        onCancel
    } : ConfirmationModalParams) : void => {
        Modal.confirm({
            centered : centered ? centered : false,
            title: title,
            content: content,
            okText: okBtn ? okBtn : t("ok"),
            cancelText: cancelBtn ? cancelBtn : t("cancel"),
            okButtonProps: {danger : okBtnDanger ? okBtnDanger : false},
            onOk: onOk,
            onCancel: onCancel,
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    }

    return {
        successModal,
        infoModal,
        warningModal,
        errorModal,
        serverErrorModal,
        confirmationModal,
    }
    
}

const styles : { [key: string]: React.CSSProperties } = {
    container : {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '1rem'
    },
    titleText : {
        textAlign: 'center',
        marginBottom: '1rem'
    },
    contentText : {
        textAlign: 'center',
    },
    icon : {
        fontSize: '100px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    success : {
        color: '#41c057'
    },
    successBtn : {
        backgroundColor: '#41c057'
    },
    info : {
        color: '#46b8da'
    },
    infoBtn : {
        backgroundColor: '#46b8da'
    },
    error : {
        color: '#CC2B12'
    },
    errorBtn : {
        backgroundColor: '#CC2B12'
    },
    warning : {
        color: '#CC2B12'
    },
    warningBtn : {
         backgroundColor: '#EEB728'
    },
    okButton : {
        display: 'block',
        margin: '0 auto',
        marginBottom: '1rem',
        marginTop: '2rem'
    }
}