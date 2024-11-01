
import { Button, Avatar, Typography, Input, Form, Space, Modal, FormProps } from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import useProfile, { ChangeUsernameForm, useChangeName, useChangeUsername } from "../hooks/accounts/useProfile";

// components
import Container from "../components/global/Container";

// utils
import { getShortenName } from "../utils/utility";

// types and interfaces
import { ChangeNmaeForm } from "../hooks/accounts/useProfile";
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
}


const { Title, Text } = Typography;


function ProfileForm({ label, value, onBtnClick } : ProfileFormProps) {
    return (
        <Form.Item
            label={label}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space.Compact style={{ width: '100%' }}>
                    <Input value={value} disabled />
                    <Button type="link" onClick={onBtnClick}>Change</Button>
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
    children
} : FormModal<T>) {

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
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default function Profile() {

    const navigate = useNavigate();

    const { userInfo } = useProfile();

    const {
        changeUsernameValue,
        openChangeUsernameModal,
        changeUsernameBtnDisabled,
        checkUsernameLoad,
        usernameValidated,
        handleChangeUsernameValue,
        handleOpenChangeUsername,
        handleChangeUsername
    } = useChangeUsername();

    const {
        openChangeNameModal,
        changeNameValue,
        changeNameBtnDisabled,
        handleSetChangeNameValue,
        handleOpenChangeName,
        handleChangeName
    } = useChangeName();
    
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
                                Change Password
                            </Button>
                        </div>
                        <div style={styles.rightSide}>
                            <Title level={2}>My Profile</Title>
                            <Text type="secondary">Manage your profile</Text>
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
                                    onBtnClick={() => {}}
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
                title="Change Username"
                description="Change your username"
                open={openChangeUsernameModal}
                onCancel={() => handleOpenChangeUsername(false)}
                handleSubmit={handleChangeUsername}
                btnDisabled={changeUsernameBtnDisabled}
            >
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: 'This field is required' },
                        {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message: 'Username must contain only letters, numbers, and underscores.',
                        },
                        {
                            max: 20,
                            message: 'Username cannot be longer than 20 characters.',
                        },
                        {
                            min: 4,
                            message: 'Username must be at least 4 characters long.',
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
                    extra={!usernameValidated && usernameValidated !== undefined ? "Username already exist" : ""}
                >
                    <Input
                        size="large"
                        placeholder="new name"
                        value={changeUsernameValue}
                        onChange={e => handleChangeUsernameValue(e.target.value)}
                        disabled={checkUsernameLoad}
                    />
                </Form.Item>
            </FormModal>

            <FormModal<ChangeNmaeForm>
                title="Change Name"
                description="Change your name"
                open={openChangeNameModal}
                onCancel={() => handleOpenChangeName(false)}
                handleSubmit={handleChangeName}
                btnDisabled={changeNameBtnDisabled}
            >
                <Form.Item
                    name="name"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'This field is required' }]}
                    initialValue={changeNameValue}
                >
                    <Input
                        size="large"
                        placeholder="new name"
                        value={changeNameValue}
                        onChange={e => handleSetChangeNameValue(e.target.value)}
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