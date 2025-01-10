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
    onClose : () => void;
    onSubmit : (data : CreateAccountData) => void;
}

export default function AddAccountModal({ form, roleOptions, open, onClose, onSubmit : submitAddAccount } : Props) {

    const { t } = useTranslation(["account", "global"]);

    const onSubmit : FormProps<AddAccountForm>['onFinish'] = (values) => {
        submitAddAccount(values);
    }

    return (
        <Modal
            title="Add New Account"
            centered
            open={open}
            // confirmLoading={confirmLoading}
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
                    label="Username"
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
                        placeholder="Username"
                        maxLength={20}
                    />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Name"
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
                        placeholder="Staff name"
                        maxLength={50}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email (Optional)"
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
                    label="Role"
                    required
                    rules={[{ required: true, message: t("global:fieldRequired") }]}
                >
                    <Select
                        placeholder="Select Role"
                        allowClear
                        options={roleOptions}
                        filterOption={(input, option) =>
                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
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
                        placeholder="Enter Password"
                        type="password"
                        maxLength={100}
                    />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Repeat Password"
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
                        placeholder="Enter Password again"
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