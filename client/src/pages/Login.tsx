import React from "react"

import {
    Button,
    Typography,
    Form,
    Input,
    FormProps,
    Checkbox,
} from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';


type LoginForm = {
    username : string;
    password : string;
    rememberMe : boolean | undefined
}


const { Title, Text } = Typography;


export default function Login() {

    const onSubmit : FormProps<LoginForm>['onFinish'] = (values) => {
        console.log(values);

        if (values.rememberMe) {
            console.log("store creds on local storage");
        }
    }

    return (
        <section style={styles.section}>
            <div style={styles.formContainer}>
                <Title level={2}>Sign In</Title>
                <Text style={styles.text}>
                    Welcome back to AntBlocks UI! Please enter your details below to sign in.
                </Text>
                <Form
                    name="login"
                    style={styles.form}
                    onFinish={onSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username or email!' }]}
                    >
                        <Input
                            placeholder="Username/Email"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
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

                        <a style={styles.forgotPassword}>Forgot Password?</a>
                    </div>

                    <Form.Item>
                        <Button style={styles.button} type="primary" htmlType="submit">
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
    }
}