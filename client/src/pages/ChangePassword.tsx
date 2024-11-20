
import { Button, Typography, Form, Input, Divider, FormProps, Alert } from "antd"

import { useTranslation } from "react-i18next";

// components
import Container from "../components/global/Container"
import { ArrowLeftOutlined } from "@ant-design/icons"

import useChangePassword from "../hooks/accounts/useChangePassword";

// types and interfaces
type ChangePasswordForm = {
    oldPassword : string;
    newPassword : string;
    newPasswordRepeat : string;
}

const { Title, Text } = Typography;



export default function ChangePassword() {

    const { userInfo, submitLoad, wrongPassMsg, handleSubmit, handleClickBack } = useChangePassword();

    const { t } = useTranslation(["account", "global"]);

    const onSubmit : FormProps<ChangePasswordForm>['onFinish'] = (values) => {
        handleSubmit({
            oldPassword : values.oldPassword,
            newPassword : values.newPassword,
        });
    }

    return (
        <Container maxWidth="27rem" bgColor="white">
            <div style={styles.holder}>
                <Button
                    shape="circle"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleClickBack}
                />
                <div style={styles.textHolder}>
                    <Title level={3}>{t("account:changePassword")}</Title>
                    <Text type="secondary">{`${t("account:createNewPassword")} ${userInfo.username}.`}</Text>
                </div>
                
                <Form
                    name="changePassword"
                    style={styles.form}
                    onFinish={onSubmit}
                    autoComplete="off"
                >
                    <Divider orientation="left">{t("account:oldPassword")}</Divider>
                    {wrongPassMsg && (
                        <Alert
                            message={wrongPassMsg}
                            type="error"
                            showIcon
                            style={styles.alert}
                        />
                    )}
                    <Form.Item
                        name="oldPassword"
                        rules={[{ required: true, message: t("global:fieldRequired") }]}
                        validateStatus={wrongPassMsg ? "error" : ""}
                    >
                        <Input.Password
                            placeholder={t("account:oldPassword")}
                            type="password"
                        />
                    </Form.Item>

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
                            loading={submitLoad}
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
    submitButton : {
        width: '100%',
        marginTop: '0.5rem'
    },
    alert : {
        marginBottom: '1.5rem'
    }
}