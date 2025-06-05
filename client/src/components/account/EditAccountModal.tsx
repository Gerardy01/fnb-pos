import { Button, Form, FormInstance, FormProps, Input, Modal, Select, SelectProps, Space, Typography } from "antd";
import { CheckOutlined, CopyOutlined, LockOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useCheckEmailAvailability, useCheckUsernameAvailability } from "../../hooks/global/useCheckAvailability";
import useGenerateOtp from "../../hooks/authentication/useGenerateOtp";

// types and interfaces
import { EditAccountManagementBodyData } from "../../models/accountInterface";
type EditAccountForm = {
    username : string;
    name : string;
    email : string | null;
    role : number;
    otpCode? : number;
}
interface Props {
    form : FormInstance;
    roleOptions : SelectProps['options'];
    open : boolean;
    selectedAccountData : EditAccountManagementBodyData | null;
    submitLoad : boolean;
    newPassword : string;
    onClose : () => void;
    onSubmit : (data : EditAccountManagementBodyData) => void;
    onDeleteAccount : () => void;
    onResetPass : () => void;
    clearNewPass : () => void;
}



const { Paragraph, Text } = Typography;

export default function EditAccountModal({ form, roleOptions, open, selectedAccountData, submitLoad, newPassword, onClose, onSubmit : submitEditAccount, onDeleteAccount, onResetPass, clearNewPass } : Props) {

    const { t } = useTranslation(["account", "global", "auth"]);

    const { usernameCheckLoad, usernameValidated, handleChangeUsernameValue, clearUsernameValidated  } = useCheckUsernameAvailability(selectedAccountData?.username);
    const { emailCheckLoad, emailValidated, handleChangeEmailValue, clearEmailalidated } = useCheckEmailAvailability(selectedAccountData?.email ? selectedAccountData?.email : "");
    const { generateOtpCountdown, generateOtpLoad, generateOtpCode, handleChangeAddress, restartCountdown } = useGenerateOtp();

    const onSubmit : FormProps<EditAccountForm>['onFinish'] = (values) => {
        submitEditAccount({
            accountId : selectedAccountData ? selectedAccountData.accountId : "",
            username : values.username,
            name : values.name,
            email : values.email,
            roleId : values.role,
            otpCode : Number(values.otpCode),
        });
        clearUsernameValidated();
        clearEmailalidated();
    }

    return (
        <>
            {selectedAccountData && (
                <Modal
                    title={`${t('account:editAccount')} ${selectedAccountData.name}`}
                    centered
                    open={open}
                    onCancel={() => {
                        onClose();
                        clearUsernameValidated();
                        clearEmailalidated();
                        restartCountdown();
                    }}
                    footer={null}
                    maskClosable={false}
                >
                    <Form
                        name="editAccountManagement"
                        onFinish={onSubmit}
                        autoComplete="off"
                        layout="vertical"
                        style={styles.form}
                        form={form}
                    >
                        <Form.Item
                            name="username"
                            label={t('account:username')}
                            initialValue={selectedAccountData.username}
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
                                usernameValidated === undefined ? undefined : ""
                            }
                        >
                            <Input
                                placeholder={t('account:username')}
                                maxLength={20}
                                onChange={e => handleChangeUsernameValue(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label={t('account:name')}
                            required
                            initialValue={selectedAccountData.name}
                            rules={[
                                { required: true, message: t("global:fieldRequired") },
                                {
                                    max: 50,
                                    message: t("account:NAME01"),
                                },
                            ]}
                        >
                            <Input
                                placeholder={t('account:staffName')}
                                maxLength={50}
                            />
                        </Form.Item>
                        <div style={styles.emailGroupFormHolder}>
                            <Form.Item
                                style={styles.emailForm}
                                name="email"
                                label={t('account:emailOptional')}
                                initialValue={selectedAccountData.email == "-" ? "" : selectedAccountData.email}
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
                                    emailValidated === undefined ? undefined : ""
                                }
                            >
                                <Input
                                    placeholder="example.email@mail.com"
                                    maxLength={50}
                                    onChange={e => {
                                        handleChangeEmailValue(e.target.value);
                                        handleChangeAddress(e.target.value);
                                        form.resetFields(["otpCode"]);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name={"otpCode"}
                                label={t("account:otp")}
                                style={styles.otpForm}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const email = getFieldValue("email");
                                            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
                                            
                                            if (
                                                (!email || email.trim() === "") ||
                                                email == selectedAccountData.email ||
                                                emailValidated == false ||
                                                !isValidEmail
                                            ) {
                                                return Promise.resolve();
                                            }

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
                                <Space direction="vertical">
                                    <Space.Compact>
                                        <Input
                                            name="otpCode"
                                            maxLength={6}
                                            disabled={
                                                (form.getFieldValue("email") == selectedAccountData.email) ||
                                                (form.getFieldValue("email") == null) ||
                                                (form.getFieldError("email").length > 0 && form.getFieldError("email")[0] != "") ||
                                                emailCheckLoad ||
                                                emailValidated == false
                                            }
                                        />
                                        <Button
                                            type="primary"
                                            disabled={
                                                (form.getFieldValue("email") == selectedAccountData.email) ||
                                                (form.getFieldValue("email") == null) ||
                                                (form.getFieldError("email").length > 0 && form.getFieldError("email")[0] != "") ||
                                                emailCheckLoad ||
                                                emailValidated == false ||
                                                generateOtpCountdown > 0
                                            }
                                            onClick={generateOtpCode}
                                            loading={generateOtpLoad}
                                        >{generateOtpCountdown > 0 ? `${generateOtpCountdown}s` : t("auth:code")}</Button>
                                    </Space.Compact>
                                </Space>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="role"
                            label={t('account:role')}
                            required
                            initialValue={selectedAccountData.roleId}
                            rules={[{ required: true, message: t("global:fieldRequired") }]}
                        >
                            <Select
                                placeholder={t('account:selectRole')}
                                allowClear
                                options={roleOptions}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                        <Form.Item>
                            <div style={styles.submitBtnHolder}>
                                <div style={styles.extraBtnHolder}>
                                    <Button
                                        type="primary"
                                        variant="solid"
                                        size="large"
                                        color="danger"
                                        style={styles.deleteBtn}
                                        disabled={submitLoad}
                                        onClick={onDeleteAccount}
                                    >
                                        {t("global:delete")}
                                    </Button>
                                    <Button
                                        type="default"
                                        size="large"
                                        disabled={submitLoad}
                                        icon={<LockOutlined />}
                                        onClick={onResetPass}
                                    >
                                        {t("account:resetPassword")}
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        loading={submitLoad}
                                        disabled={emailCheckLoad}
                                    >
                                        {t("global:submit")}
                                    </Button>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            )}

            <Modal
                title={t('account:newPassword')}
                centered
                open={newPassword !== ""}
                onCancel={clearNewPass}
                footer={null}
                maskClosable={false}
                destroyOnClose
                width={350}
            >
                <Paragraph
                    copyable={{
                        icon: [
                            <CopyOutlined style={{ fontSize: '1.3rem', color: 'gray' }} />,
                            <CheckOutlined style={{ fontSize: '1.3rem', color: 'gray' }} />
                        ],
                        text: newPassword
                    }}
                    style={styles.newPassHolder}
                >
                    <Text style={styles.newPasswordText}>
                        {newPassword}
                    </Text>
                </Paragraph>
            </Modal>
        </>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    form : {
        paddingTop: '1rem',
    },
    emailGroupFormHolder : {
        display: 'flex'
    },
    otpForm : {
        marginLeft: '10px',
        width: '30%'
    },
    emailForm : {
        flex: 1
    },
    submitBtnHolder : {
        width: '100%',
        marginBottom: '0px',
        marginTop: '2rem',
        justifyContent: 'space-between',
        display: 'flex'
    },
    extraBtnHolder : {
        display: 'flex'
    },
    deleteBtn : {
        marginRight: '15px'
    },
    newPassHolder : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: '5px',
        padding: '15px',
        marginTop: '20px'
    },
    newPasswordText : {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        textAlign: 'center',
        marginRight: '10px',
    }
}