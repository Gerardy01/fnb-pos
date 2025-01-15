import { Button, Form, FormInstance, FormProps, Input, Modal, Select, SelectProps } from "antd";

import { useTranslation } from "react-i18next";

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

export default function AddAccountModal({ form, roleOptions, open, submitLoad, onClose, onSubmit : submitAddAccount } : Props) {

    const { t } = useTranslation(["account", "global"]);

    const onSubmit : FormProps<AddAccountForm>['onFinish'] = (values) => {
        submitAddAccount(values);
    }

    return (
        <Modal
            title={t('account:addNewAccount')}
            centered
            open={open}
            onCancel={onClose}  
            footer={null}
            maskClosable={false}
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
                        }
                    ]}
                >
                    <Input
                        placeholder={t('account:username')}
                        maxLength={20}
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
                <Form.Item
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
                    ]}
                >
                    <Input
                        placeholder="example.email@mail.com"
                        maxLength={50}
                    />
                </Form.Item>
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
                    validateTrigger="onSubmit"
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
    submitBtnHolder : {
        marginBottom: '0px',
        marginTop: '2rem',
        flex: 1,
        justifyContent: 'center',
        display: 'flex'
    },
}