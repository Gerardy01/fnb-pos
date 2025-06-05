
import { Button, Avatar, Typography, Input, Form, Space, Modal, FormProps } from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import useProfile, { useChangeName, useChangeUsername, useChangeEmail } from "../hooks/accounts/useProfile";
import { useCheckEmailAvailability, useCheckUsernameAvailability } from "../hooks/global/useCheckAvailability";
import { useTranslation } from "react-i18next";
import useGenerateOtp from "../hooks/authentication/useGenerateOtp";

// components
import Container from "../components/global/Container";

// utils
import { getShortenName } from "../utils/utility";

// types and interfaces
import { ChangeUsernameForm, ChangeNameForm, ChangeEmailForm } from "../hooks/accounts/useProfile";
interface ProfileFormProps {
    label : string;
    value : string;
    onBtnClick : () => void;
}
interface FormModal<T> {
    title : string;
    description : string;
    open : boolean;
    onCancel : () => void;
    handleSubmit : (data : T) => void;
    children : JSX.Element;
    btnDisabled? : boolean;
    btnLoad? : boolean;
}


const { Title, Text } = Typography;


function ProfileForm({ label, value, onBtnClick } : ProfileFormProps) {

    const  { t } = useTranslation(["global"]);

    return (
        <Form.Item
            label={label}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space.Compact style={{ width: '100%' }}>
                    <Input value={value} readOnly />
                    <Button type="link" onClick={onBtnClick}>{t("change")}</Button>
                </Space.Compact>
            </Space>
        </Form.Item>
    )
}

function FormModal<T>({
    title,
    description,
    open,
    btnDisabled = false,
    onCancel,
    handleSubmit,
    children,
    btnLoad = false,
} : FormModal<T>) {

    const  { t } = useTranslation(["global"]);

    const onSubmit : FormProps<T>['onFinish']= (values) => {
        handleSubmit(values);
    }

    return (
        <Modal
            title={title}
            open={open}
            centered
            onCancel={onCancel}
            footer={[]}
        >
            <Form
                onFinish={onSubmit}
                autoComplete="off"
            >
                <div style={styles.formModalDesc}>
                    <Text>{description}</Text>
                </div>
                {children}
                <Form.Item>
                    <Button
                        key="submit"
                        type="primary"
                        size="large"
                        style={styles.formModalBtn}
                        htmlType="submit"
                        disabled={btnDisabled}
                        loading={btnLoad}
                    >
                        {t("submit")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default function Profile() {

    const navigate = useNavigate();

    const { userInfo } = useProfile();

    const  { t } = useTranslation(["global", "account"]);

    const { usernameCheckLoad, usernameValidated, handleChangeUsernameValue } = useCheckUsernameAvailability(userInfo.username);
    const { emailCheckLoad, emailValidated, handleChangeEmailValue, clearEmailalidated } = useCheckEmailAvailability(userInfo.email);

    const { generateOtpCountdown, generateOtpLoad, generateOtpCode, handleChangeAddress, restartCountdown } = useGenerateOtp();

    const {
        openChangeUsernameModal,
        changeUsernameLoad,
        changeUsernameErrorMsg,
        handleOpenChangeUsername,
        handleChangeUsername
    } = useChangeUsername();

    const {
        openChangeNameModal,
        changeNameValue,
        changeNameBtnDisabled,
        changeNameLoad,
        handleSetChangeNameValue,
        handleOpenChangeName,
        handleChangeName
    } = useChangeName();

    const {
        changeEmailForm,
        openChangeEmailModal,
        changeEmailLoad,
        changeEmailErrorMsg,
        changeEmailStep,
        handleOpenChangeEmail,
        handleChangeEmail,
        handleChangeEmailStep,
    } = useChangeEmail();

    const onChangeEmail : FormProps<ChangeEmailForm>['onFinish']= (values) => {
        handleChangeEmail(values);
    }
    
    return (
        <>
            <Container bgColor="white" maxWidth="60rem">
                <>
                    <Button
                        shape="circle"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={styles.backButton}
                    />
                    <div style={styles.container}>
                        <div style={styles.leftSide}>
                            <Avatar
                                size={240}
                                style={styles.avatar}
                            >
                                {getShortenName(userInfo.name)}
                            </Avatar>
                            <Title level={3} style={styles.nameText}>{userInfo.name}</Title>
                            <Button
                                size="large"
                                type="default"
                                shape="round"
                                icon={<LockOutlined />}
                                onClick={() => navigate("/dashboard/change-password")}
                            >
                                {t("account:changePassword")}
                            </Button>
                        </div>
                        <div style={styles.rightSide}>
                            <Title level={2}>{t("account:myProfile")}</Title>
                            <Text type="secondary">{t("account:myProfileDesc")}</Text>
                            <Form
                                style={styles.form}
                                layout="vertical"
                            >
                                <ProfileForm
                                    label="Username"
                                    value={userInfo.username}
                                    onBtnClick={() => handleOpenChangeUsername(true)}
                                />
                                <ProfileForm
                                    label="Name"
                                    value={userInfo.name}
                                    onBtnClick={() => handleOpenChangeName(true)}
                                />
                                <ProfileForm
                                    label="Email"
                                    value={userInfo.email}
                                    onBtnClick={() => handleOpenChangeEmail(true)}
                                />
                                <div style={styles.unEditableFormHolder}>
                                    <Form.Item
                                        label="Role"
                                        style={{ flex: 1 }}
                                    >
                                        <Input value={userInfo.roleName} disabled />
                                    </Form.Item>
                                    <div style={styles.decoy} />
                                </div>
                            </Form>
                        </div>
                    </div>
                </>
            </Container>

            <FormModal<ChangeUsernameForm>
                title={t("account:changeUsername")}
                description={t("account:changeUsernameDesc")}
                open={openChangeUsernameModal}
                onCancel={() => handleOpenChangeUsername(false)}
                handleSubmit={handleChangeUsername}
                btnDisabled={!usernameValidated || usernameCheckLoad}
                btnLoad={changeUsernameLoad || usernameCheckLoad}
            >
                <Form.Item
                    name="username"
                    required
                    rules={[
                        { required: true, message: t("global:fieldRequired") },
                        {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message: t("account:USERNAME03"),
                        },
                        {
                            max: 20,
                            message: t("account:USERNAME02"),
                        },
                        {
                            min: 4,
                            message: t("account:USERNAME01"),
                        },
                        {
                            validator: async () => {
                                if (usernameValidated === false) {
                                    throw new Error();
                                }
                            }
                        }
                    ]}
                    hasFeedback={usernameValidated === undefined ? false : true}
                    validateStatus={
                        usernameValidated === undefined ? undefined :
                        usernameCheckLoad ? "validating" :
                        !usernameValidated ? "error" : "success"
                    }
                    help={
                        !usernameValidated && usernameValidated !== undefined ? t("account:ACCOUNT409-1") :
                        changeUsernameErrorMsg ? changeEmailErrorMsg :
                        usernameValidated === undefined ? undefined : ""
                    }
                >
                    <Input
                        size="large"
                        placeholder={t("account:newUsername")}
                        maxLength={20}
                        defaultValue={userInfo.username}
                        onChange={e => handleChangeUsernameValue(e.target.value)}
                    />
                </Form.Item>
            </FormModal>

            <FormModal<ChangeNameForm>
                title={t("account:changeName")}
                description={t("account:changeNameDesc")}
                open={openChangeNameModal}
                onCancel={() => handleOpenChangeName(false)}
                handleSubmit={handleChangeName}
                btnDisabled={changeNameBtnDisabled}
                btnLoad={changeNameLoad}
            >
                <Form.Item
                    name="name"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: t("global:fieldRequired") }]}
                    initialValue={changeNameValue}
                >
                    <Input
                        size="large"
                        placeholder={t("account:newName")}
                        value={changeNameValue}
                        onChange={e => handleSetChangeNameValue(e.target.value)}
                        maxLength={50}
                    />
                </Form.Item>
            </FormModal >

            <Modal
                title={t("account:changeEmail")}
                open={openChangeEmailModal}
                centered
                onCancel={() => {
                    handleOpenChangeEmail(false)
                    clearEmailalidated();
                    restartCountdown();
                }}
                footer={[]}
                maskClosable={false}
            >
                <Form
                    onFinish={onChangeEmail}
                    autoComplete="off"
                    form={changeEmailForm}
                >
                    <div style={{ display: changeEmailStep === 0 ? 'block' : 'none' }}>

                        <div style={styles.formModalDesc}>
                            <Text>{t("account:changeEmailDesc")}</Text>
                        </div>
                        <Form.Item
                            name="email"
                            required
                            rules={[
                                {
                                    max: 50,
                                    message: t("account:EMAIL02"),
                                },
                                { 
                                    type: 'email', 
                                    message: t("account:EMAIL01") 
                                },
                                {
                                    validator: async () => {
                                        if (emailValidated === false) {
                                            throw new Error();
                                        }
                                    }
                                }
                            ]}
                            hasFeedback={emailValidated === undefined ? false : true}
                            validateStatus={
                                emailValidated === undefined ? undefined :
                                emailCheckLoad ? "validating" :
                                !emailValidated ? "error" : "success"
                            }
                            help={
                                !emailValidated && emailValidated !== undefined ? t("account:ACCOUNT409-2") :
                                changeEmailErrorMsg ? changeEmailErrorMsg :
                                emailValidated === undefined ? undefined : ""
                            }
                        >
                            <Input
                                size="large"
                                placeholder={t("account:newEmail")}
                                maxLength={50}
                                defaultValue={userInfo.email}
                                onChange={e => {
                                    handleChangeEmailValue(e.target.value);
                                    handleChangeAddress(e.target.value);
                                }}
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            size="large"
                            style={styles.formModalBtn}
                            disabled={!emailValidated || emailCheckLoad}
                            loading={changeEmailLoad || emailCheckLoad}
                            onClick={() => {
                                changeEmailForm.validateFields(['email']).then(() => {
                                    handleChangeEmailStep(1);
                                    generateOtpCode();
                                });
                            }}
                        >
                            {t("global:continue")}
                        </Button>
                    </div>
                    
                    <div style={{ display: changeEmailStep === 1 ? 'block' : 'none' }}>
                        <div style={styles.formModalDesc}>
                            <Text>OTP has been sent. Didn't get your code?</Text>
                            <Button
                                type="link"
                                size="small"
                                onClick={generateOtpCode}
                                loading={generateOtpLoad}
                                disabled={generateOtpCountdown > 0}
                            >
                                Get OTP {generateOtpCountdown > 0 ? `${generateOtpCountdown}s` : ""}
                            </Button>
                        </div>
                        <Form.Item
                            name='otpCode'
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                            required
                            rules={[
                                () => ({
                                    validator(_, value) {
                                        if (!value || value.length < 6) {
                                            return Promise.reject(t("account:ACCOUNT403-6"));
                                        }

                                        if (Number.isNaN(Number(value))) {
                                            return Promise.reject(t("account:otpMustNumber"))
                                        }

                                        return Promise.resolve();
                                    }
                                })
                            ]}
                        >
                            <Input.OTP
                                length={6}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                key="submit"
                                type="primary"
                                size="large"
                                style={styles.formModalBtn}
                                htmlType="submit"
                                disabled={!emailValidated || emailCheckLoad}
                                loading={changeEmailLoad}
                            >
                                {t("global:submit")}
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    backButton : {
        marginTop: '1rem'
    },
    container : {
        width: '100%',
        display: 'flex',
        paddingTop: '1.5rem'
    },
    leftSide : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 2rem',
        marginRight: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '30px',
        boxShadow: '0px 0px 5px 1px lightgray',
        flex: 1
    },
    rightSide : {
        width: '75%',
    },
    avatar : {
        fontSize: '5rem',
        marginBottom: '1rem',
        border: '5px solid lightgray'
    },
    nameText : {
        textAlign: 'center',
        marginBottom: '4rem'
    },
    form : {
        width: '100%',
        marginTop: '1.5rem'
    },
    unEditableFormHolder : {
        flex: 1,
        maxWidth: '100%',
        display: 'flex'
    },
    decoy : {
        width: '5rem'
    },
    formModalDesc : {
        margin: '1.5rem 0px',
    },
    formModalBtn : {
        width: '100%',
        marginTop: '2rem'
    }
}