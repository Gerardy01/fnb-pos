import { Alert, Button, Empty, Form, FormInstance, FormProps, Input, List, Modal, Select, SelectProps, Space, Table, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { useCheckEmailAvailability, useCheckUsernameAvailability } from "../../hooks/global/useCheckAvailability";
import useGenerateOtp from "../../hooks/authentication/useGenerateOtp";

// types and interfaces
import { CreateAccountData } from "../../models/accountInterface";
type AddAccountForm = {
    username : string;
    name : string;
    email : string | null;
    role : number;
    password : string;
    confirmPassword : string;
}
interface Props {
    form : FormInstance;
    roleOptions : SelectProps['options'];
    open : boolean;
    submitLoad : boolean;
    onClose : () => void;
    onSubmit : (data : CreateAccountData) => void;
}


const { Text } = Typography


export default function AddAccountModal({ form, roleOptions, open, submitLoad, onClose, onSubmit : submitAddAccount } : Props) {

    const { t } = useTranslation(["account", "global", "auth"]);

    const { usernameCheckLoad, usernameValidated, handleChangeUsernameValue, clearUsernameValidated } = useCheckUsernameAvailability();
    const { emailCheckLoad, emailValidated, handleChangeEmailValue, clearEmailalidated } = useCheckEmailAvailability();
    const { generateOtpCountdown, generateOtpLoad, generateOtpCode, handleChangeAddress, restartCountdown } = useGenerateOtp();

    const onSubmit : FormProps<AddAccountForm>['onFinish'] = (values) => {
        submitAddAccount(values);
        clearUsernameValidated();
        clearEmailalidated();
    }

    return (
        <Modal
            title={t('account:addNewAccount')}
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
            width={700}
            style={styles.modalHolder}
        >
            <Form
                name="addAccount"
                onFinish={onSubmit}
                autoComplete="off"  
                layout='vertical'
                style={styles.form}
                form={form}
            >
                <Form.Item
                    name="username"
                    label={t('account:username')}
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
                        onChange={(e) => handleChangeUsernameValue(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    name="name"
                    label={t('account:name')}
                    required
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
                                        (form.getFieldValue("email") == null) ||
                                        (form.getFieldValue("email") == "") ||
                                        (form.getFieldError("email").length > 0 && form.getFieldError("email")[0] != "") ||
                                        emailCheckLoad ||
                                        emailValidated == false
                                    }
                                />
                                <Button
                                    type="primary"
                                    disabled={
                                        (form.getFieldValue("email") == null) ||
                                        (form.getFieldValue("email") == "") ||
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

                <div style={styles.outletAssignationHolder}>
                    <div style={styles.subTitleHolder} >
                        <Text strong>{t("account:assignOutlets")}</Text>
                        <Button
                            icon={<EditOutlined />}
                        >
                            {t("global:assign")}
                        </Button>
                    </div>

                    {/* <Alert
                        message={t("account:noOutletErrMsg")}
                        type="error"
                        showIcon
                        style={styles.alert}
                    /> */}

                    <div style={styles.noOutletHolder}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>

                    {/* <List
                        bordered
                        dataSource={[
                            {
                                id: "teasdasd",
                                outletName : "Kebon Jeruk"
                            },
                            {
                                id: "teasdasasasddsd",
                                outletName : "asdadada a dhs dasdad"
                            },
                            {
                                id: "sd",
                                outletName : "Jakarta"
                            },
                        ]}
                        renderItem={(item) => (
                            <List.Item>
                                {item.outletName}
                            </List.Item>
                        )}
                    /> */}

                </div>
                    
                <div style={styles.subTitleHolder} >
                    <Text strong>{t("account:accountPass")}</Text>
                </div>

                <Form.Item
                    name="password"
                    label={t('account:password')}
                    required
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
                        placeholder={t('account:enterPassword')}
                        type="password"
                        maxLength={100}
                    />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label={t('account:repeatPassword')}
                    required
                    dependencies={['password']}
                    validateTrigger="onBlur"
                    rules={[
                        { required: true, message: t("global:fieldRequired") },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t("account:passwordNotMatch")));
                            }
                        })
                    ]}
                >
                    <Input.Password
                        placeholder={t('account:enterPasswordAgain')}
                        type="password"
                        maxLength={100}
                        onFocus={() => form.setFields([{ name: 'confirmPassword', errors: [] }])}
                    />
                </Form.Item>
                <Form.Item
                    style={styles.submitBtnHolder}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={submitLoad}
                        disabled={emailCheckLoad || usernameCheckLoad}
                    >
                        {t("global:submit")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    form : {
        paddingTop: '1rem',
    },
    modalHolder : {
        marginTop: '2rem',
        marginBottom: '2rem'
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
        marginBottom: '0px',
        marginTop: '2rem',
        flex: 1,
        justifyContent: 'center',
        display: 'flex'
    },
    subTitleHolder: {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    outletAssignationHolder: {
        marginBottom: '2rem',
        marginTop: '2rem'
    },
    noOutletHolder: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    alert : {
        width: '100%',
    }
}