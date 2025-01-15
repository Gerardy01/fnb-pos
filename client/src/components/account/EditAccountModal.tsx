import { Button, Form, FormInstance, FormProps, Input, Modal, Select, SelectProps } from "antd";

import { useTranslation } from "react-i18next";

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

    const onSubmit : FormProps<EditAccountForm>['onFinish'] = (values) => {
        submitEditAccount({
            accountId : selectedAccountData ? selectedAccountData.accountId : "",
            username : values.username,
            name : values.name,
            email : values.email,
            roleId : values.role
        });
    }

    return (
        <>
            {selectedAccountData && (
                <Modal
                    title={`Edit Account ${selectedAccountData.name}`}
                    centered
                    open={open}
                    onCancel={onClose}
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
                            label="Username"
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
                                placeholder="Staff name"
                                maxLength={50}
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email (Optional)"
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
                            initialValue={selectedAccountData.roleId}
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