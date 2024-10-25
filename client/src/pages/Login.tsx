import React from "react"
import { useNavigate } from "react-router-dom";

import useCache from "../hooks/useCache";
import useLogin from "../hooks/authentication/useLogin";

import {
    Button,
    Typography,
    Form,
    Input,
    FormProps,
    Checkbox,
    Alert,
} from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

// components
import PageLoading from "../components/loading/PageLoading";

// types and interfaces
type LoginForm = {
    username : string;
    password : string;
    rememberMe : boolean | undefined
}


const { Title, Text } = Typography;


export default function Login() {

    const navigate = useNavigate();
    const { getRememberMeData } = useCache();
    const { pageLoading, loginLoad, errorMessage, submitLogin } = useLogin();

    const { t } = useTranslation('auth');

    const { identifier, password } = getRememberMeData();

    const onSubmit : FormProps<LoginForm>['onFinish'] = (values) => {
        submitLogin({
            identifier : values.username,
            password : values.password,
            rememberMe : values.rememberMe ? values.rememberMe : false
        });
    }

    if (pageLoading) {
        return (
            <PageLoading />
        )
    }

    return (
        <section style={styles.section}>
            <div style={styles.formContainer}>
                <Title level={2}>{t("signIn")}</Title>
                <Text style={styles.text}>
                    {t("loginWelcome")}
                </Text>

                {errorMessage && (
                    <Alert
                        message={t(errorMessage)}
                        type="error"
                        showIcon
                        style={styles.alert}
                    />
                )}
                <Form
                    name="login"
                    style={styles.form}
                    onFinish={onSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: t("AUTH002") }]}
                        initialValue={identifier}
                        validateStatus={errorMessage ? "error" : ""}
                    >
                        <Input
                            placeholder="Username/Email"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: t("AUTH003") }]}
                        initialValue={password}
                        validateStatus={errorMessage ? "error" : ""}
                    >
                        <Input.Password
                            placeholder="password"
                            type="password"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>

                    <div style={styles.formContentHolder}>
                        <Form.Item
                            name="rememberMe"
                            valuePropName="checked"
                            initialValue={identifier !== "" && password !== ""}
                        >
                            <Checkbox>{t("rememberMe")}</Checkbox>
                        </Form.Item>

                        <div style={styles.forgotPassword}>
                            <a
                                onClick={() => navigate("/forgot-password")}
                            >{t("forgotPassword")}</a>
                        </div>
                    </div>

                    <Form.Item>
                        <Button
                            style={styles.button}
                            type="primary"
                            htmlType="submit"
                            loading={loginLoad}
                        >
                            {t("login")}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </section>
    )
}


const styles : { [key: string]: React.CSSProperties } = {
    section : {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 1rem'
    },
    formContainer : {
        flex: '1',
        maxWidth: '20rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    text : {
        textAlign: 'center'
    },
    form : {
        width: '100%',
        marginTop: '2rem'
    },
    button : {
        width: '100%'
    },
    formContentHolder : {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    forgotPassword : {
        paddingTop: '5px'
    },
    alert : {
        marginTop: '1rem',
        width: '100%'
    }
}