import React from "react"
import { useNavigate } from "react-router-dom";

import {
    Button,
    Typography,
    Form,
    Input,
    FormProps,
    Checkbox,
    Alert
} from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';


type LoginForm = {
    username : string;
    password : string;
    rememberMe : boolean | undefined
}


const { Title, Text } = Typography;


export default function Login() {

    const navigate = useNavigate();

    const onSubmit : FormProps<LoginForm>['onFinish'] = (values) => {
        console.log(values);

        if (values.rememberMe) {
            console.log("store creds on local storage");
        } else {
            console.log("remove creds from local storage")
        }
    }

    return (
        <section style={styles.section}>
            <div style={styles.formContainer}>
                <Title level={2}>Sign In</Title>
                <Text style={styles.text}>
                    Welcome back to Kumabit POS! Please enter your details below to sign in.
                </Text>
                <Alert
                    message="Sorry, we couldn't find account with that credentials. We can help changing your password using Forgot Password."
                    type="error"
                    showIcon
                    style={styles.alert}
                />
                <Form
                    name="login"
                    style={styles.form}
                    onFinish={onSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username or email!' }]}
                        initialValue={"test"}
                    >
                        <Input
                            placeholder="Username/Email"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        initialValue={"test"}
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
                        >
                            <Checkbox>Remember Me</Checkbox>
                        </Form.Item>

                        <a
                            style={styles.forgotPassword}
                            onClick={() => navigate("/forgot-password")}
                        >Forgot Password?</a>
                    </div>

                    <Form.Item>
                        <Button
                            style={styles.button}
                            type="primary"
                            htmlType="submit"
                            loading={false}
                        >
                            Log In
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
        marginTop: '1rem'
    }
}