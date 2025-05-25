import { Button, Form, FormInstance, FormProps, Input, Modal, Select, SelectProps } from "antd";
import { LockOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useCheckEmailAvailability, useCheckUsernameAvailability } from "../../hooks/global/useCheckAvailability";

// types and interfaces
import { EditAccountManagementBodyData } from "../../models/accountInterface";
type EditAccountForm = {
    username : string;
    name : string;
    email : string | null;
    role : number;
}
interface Props {
    form : FormInstance;
    roleOptions : SelectProps['options'];
    open : boolean;
    selectedAccountData : EditAccountManagementBodyData | null;
    submitLoad : boolean;
    onClose : () => void;
    onSubmit : (data : EditAccountManagementBodyData) => void;
}


export default function EditAccountModal({ form, roleOptions, open, selectedAccountData, submitLoad, onClose, onSubmit : submitEditAccount } : Props) {

    const { t } = useTranslation(["account", "global"]);

    const { usernameCheckLoad, usernameValidated, handleChangeUsernameValue, clearUsernameValidated  } = useCheckUsernameAvailability(selectedAccountData?.username);
    const { emailCheckLoad, emailValidated, handleChangeEmailValue, clearEmailalidated } = useCheckEmailAvailability(selectedAccountData?.email ? selectedAccountData?.email : "");

    const onSubmit : FormProps<EditAccountForm>['onFinish'] = (values) => {
        submitEditAccount({
            accountId : selectedAccountData ? selectedAccountData.accountId : "",
            username : values.username,
            name : values.name,
            email : values.email,
            roleId : values.role
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
                        <Form.Item
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
                                onChange={e => handleChangeEmailValue(e.target.value)}
                            />
                        </Form.Item>
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
                                    >
                                        {t("global:delete")}
                                    </Button>
                                    <Button
                                        type="default"
                                        size="large"
                                        disabled={submitLoad}
                                        icon={<LockOutlined />}
                                    >
                                        {t("account:changePassword")}
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        loading={submitLoad}
                                    >
                                        {t("global:submit")}
                                    </Button>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    form : {
        paddingTop: '1rem',
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
    }
}