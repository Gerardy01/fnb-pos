import { Button, Divider, Form, Input, Typography } from "antd";

import { useForgotPasswordChange } from "../hooks/authentication/useForgotPassword"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// components
import PageLoading from "../components/loading/PageLoading";
import Container from "../components/global/Container";

const { Title, Text } = Typography;



export default function ForgotPasswordChange() {

    const navigate = useNavigate();

    const { t } = useTranslation(["account", "global", "auth"]);

    const { pageLoading, loading, passChanged, handleChangePass } = useForgotPasswordChange();

    if (pageLoading) {
        return (
            <PageLoading />
        )
    }

    if (passChanged) {
        return (
            <section style={styles.section}>
                <Form style={styles.formContainer}>
                    <Title level={2}>{t("global:success")}</Title>
                    <div style={styles.msgHolder}>
                        <Text>{t("auth:successForgotPass")}</Text>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate("/login")}
                        style={styles.button}
                    >
                        {t("auth:goBackLogin")}
                    </Button>
                </Form>
            </section>
        )
    }

    return (
        <Container maxWidth="27rem" bgColor="white">
            <div style={styles.holder}>
                <div style={styles.textHolder}>
                    <Title level={3}>{t("account:resetPassword")}</Title>
                    <Text type="secondary">{t("account:resetPasswordMsg")}</Text>
                </div>

                <Form
                    name="forgotPassword"
                    style={styles.form}
                    onFinish={handleChangePass}
                    autoComplete="off"
                >
                    <Divider orientation="left">{t("account:newPassword")}</Divider>
                    <Form.Item
                        name="newPassword"
                        validateDebounce={500}
                        hasFeedback
                        rules={[
                            { required: true, message: t("global:fieldRequired") },
                            { min: 8, message: t("account:PASS01") },
                            {
                                pattern: /^(?=.*[A-Z]).*$/,
                                message: t("account:PASS02")
                            },
                            {
                                pattern: /^(?=.*\d).*$/,
                                message:t("account:PASS03")
                            },
                            {
                                max: 100,
                                message: t("account:PASS04"),
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder={t("account:newPassword")}
                            type="password"
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPasswordRepeat"
                        dependencies={['newPassword']}
                        validateTrigger="onSubmit"
                        rules={[
                            { required: true, message: t("global:fieldRequired") },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t("account:passwordNotMatch")));
                                }
                            })
                        ]}
                    >
                        <Input.Password
                            placeholder={t("account:retype")}
                            type="password"
                        />
                    </Form.Item>

                     <Form.Item>
                        <Button
                            style={styles.submitButton}
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                        >
                            {t("global:submit")}
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </Container>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    holder : {
        marginTop: '1rem',
    },
    textHolder : {
        padding: '1.5rem 0px'
    },
    form: {
        width: '100%'
    },
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
    msgHolder : {
        marginBottom: '2rem',
        textAlign: 'center'
    },
    button : {
        width: '100%',
        marginTop: '0.5rem'
    },
}