import { MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Typography } from "antd"

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useForgotPassword } from "../hooks/authentication/useForgotPassword";

// components
import PageLoading from "../components/loading/PageLoading";


const { Title, Text } = Typography



export default function ForgotPassword() {

    const navigate = useNavigate();

    const { t } = useTranslation(['auth', 'account', 'global']);

    const { errorMessage, loading, pageLoading, notAdmin, generated, handleSendResetInstruction } = useForgotPassword();

    if (pageLoading) {
        return (
            <PageLoading />
        )
    }

    return (
        <section style={styles.section}>
            <div style={styles.formContainer}>
                {!notAdmin && !generated ? (
                    <>
                        <Title level={2}>{t("auth:forgotPass")}</Title>
                        <Text>{t("auth:forgotPassDesc")}</Text>

                        {errorMessage !== "" && (
                            <Alert
                                message={errorMessage}
                                type="error"
                                showIcon
                                style={styles.alert}
                            />
                        )}

                        <Form
                            name="forgotPassword"
                            style={styles.form}
                            autoComplete="off"
                            onFinish={handleSendResetInstruction}
                        >
                            <Form.Item
                                name="email"
                                validateTrigger="onSubmit"
                                rules={[
                                    {
                                        required: true,
                                        message: t("auth:AUTH004") 
                                    },
                                    {
                                        max: 50,
                                        message: t("account:EMAIL02"),
                                    },
                                    { 
                                        type: 'email', 
                                        message: t("account:EMAIL01") 
                                    },
                                ]}
                                validateStatus={errorMessage !== "" ? "error" : ""}
                            >
                                <Input
                                    placeholder="example@mail.com"
                                    prefix={<MailOutlined />}
                                    maxLength={50}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    style={styles.button}
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                >
                                    {t("resetInstructions")}
                                </Button>
                            </Form.Item>

                            <div>
                                <a
                                    onClick={() => navigate("/login")}
                                >{t("auth:returnLogin")}</a>
                            </div>
                        </Form>
                    </>
                ) : generated ? (
                    <Form>
                        <Title level={2}>{t("global:success")}</Title>
                        <div style={styles.msgHolder}>
                            <Text>{t("auth:tokenGeneratedMsg")}</Text>
                        </div>
                        <a
                            onClick={() => navigate("/login")}
                        >{t("auth:returnLogin")}</a>
                    </Form>
                ) : (
                    <Form>
                        <div style={styles.msgHolder}>
                            <Text>{t("auth:notAdminMsg")}</Text>
                        </div>
                        <a
                            onClick={() => navigate("/login")}
                        >{t("auth:returnLogin")}</a>
                    </Form>
                )}
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
        flexDirection: 'column'
    },
    form : {
        width: '100%',
        marginTop: '2rem'
    },
    button : {
        width: '100%',
        marginTop: '1rem'
    },
    msgHolder : {
        marginBottom: '2rem'
    },
    alert : {
        marginTop: '1rem',
        width: '100%'
    }
}