
import { Button, Avatar, Typography, Input, Form, Space, Modal, FormProps } from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import useProfile, { useChangeName, useChangeUsername, useChangeEmail } from "../hooks/accounts/useProfile";
import { useTranslation } from "react-i18next";

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

    const {
        changeUsernameValue,
        openChangeUsernameModal,
        changeUsernameBtnDisabled,
        checkUsernameLoad,
        usernameValidated,
        changeUsernameLoad,
        handleChangeUsernameValue,
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
        changeEmailValue,
        openChangeEmailModal,
        changeEmailBtnDisabled,
        checkEmailLoad,
        emailValidated,
        changeEmailLoad,
        handleChangeEmailValue,
        handleOpenChangeEmail,
        handleChangeEmail
    } = useChangeEmail();
    
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
                btnDisabled={changeUsernameBtnDisabled}
                btnLoad={changeUsernameLoad}
            >
                <Form.Item
                    name="username"
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
                        }
                    ]}
                    validateFirst
                    initialValue={changeUsernameValue}
                    hasFeedback
                    validateStatus={
                        checkUsernameLoad ? "validating" :
                        usernameValidated === undefined ? "" :
                        !usernameValidated ? "error" : "success"
                    }
                    extra={!usernameValidated && usernameValidated !== undefined ? t("account:ACCOUNT409-1") : ""}
                >
                    <Input
                        size="large"
                        placeholder={t("account:newUsername")}
                        value={changeUsernameValue}
                        onChange={e => handleChangeUsernameValue(e.target.value)}
                        disabled={checkUsernameLoad}
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
                    />
                </Form.Item>
            </FormModal>

            <FormModal<ChangeEmailForm>
                title={t("account:changeEmail")}
                description={t("account:changeEmailDesc")}
                open={openChangeEmailModal}
                onCancel={() => handleOpenChangeEmail(false)}
                handleSubmit={handleChangeEmail}
                btnDisabled={changeEmailBtnDisabled}
                btnLoad={changeEmailLoad}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            max: 50,
                            message: t("account:EMAIL02"),
                        },
                        { 
                            type: 'email', 
                            message: t("account:EMAIL01") 
                        },
                    ]}
                    validateFirst
                    initialValue={changeEmailValue}
                    hasFeedback 
                    validateStatus={
                        checkEmailLoad ? "validating" :
                        emailValidated === undefined ? "" :
                        !emailValidated ? "error" : "success"
                    }
                    extra={!emailValidated && emailValidated !== undefined ? t("account:ACCOUNT409-2") : ""}
                >
                    <Input
                        size="large"
                        placeholder={t("account:newEmail")}
                        value={changeUsernameValue}
                        onChange={e => handleChangeEmailValue(e.target.value)}
                        disabled={checkEmailLoad}
                    />
                </Form.Item>
            </FormModal>
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