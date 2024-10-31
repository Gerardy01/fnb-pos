
import { Button, Avatar, Typography, Input, Form, Space, Modal, FormProps } from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/accounts/useProfile";

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

function FormModal<T>({ title, description, open, onCancel, handleSubmit, children } : FormModal<T>) {

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

    const {
        userInfo,
        openChangeNameModal,
        handleOpenChangeName,
        handleChangeName
    } = useProfile();
    
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
                                    onBtnClick={() => {}}
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
            <FormModal<ChangeNmaeForm>
                title="Change Name"
                description="Change your name"
                open={openChangeNameModal}
                onCancel={() => handleOpenChangeName(false)}
                handleSubmit={handleChangeName}
            >
                <Form.Item
                    name="name"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'This field is required' }]}
                    initialValue={userInfo.name}
                >
                    <Input
                        size="large"
                        placeholder="new name"
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