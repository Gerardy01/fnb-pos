import { Button, Form, Input, Modal, Switch, Typography } from "antd";

import { useTranslation } from "react-i18next";

import { useAddRole } from "../../hooks/roles/useRoleManagement";

// types and interfaces
import { PageAccessPermissionData, PermissionData } from "../../models/permissionInterface";
interface Props {
    open : boolean;
    permissions : PermissionData[];
    pageAccessPermissions : PageAccessPermissionData[];
    onClose : () => void;
}

const { TextArea } = Input;
const { Text } = Typography;

export default function AddRoleModal({
    open,
    permissions,
    pageAccessPermissions,
    onClose,
} : Props) {

    const { t } = useTranslation(["global", "role"]);
    const {
        addRoleForm,
        selectedPermission,
        selectedPageAccessPermission,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        resetData,
    } = useAddRole();

    return (
        <Modal
            title={t("role:addNewRole")}
            centered
            open={open}
            onCancel={() => {
                onClose();
                resetData();
            }}  
            footer={null}
            maskClosable={false}
            width={800}
            style={styles.modalHolder}
        >
            <Form
                name="addRole"
                layout="vertical"
                form={addRoleForm}
                style={styles.form}
            >
                <Form.Item
                    name="roleName"
                    label={t('role:roleName')}
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
                        placeholder="example.email@mail.com"
                        maxLength={50}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={t('global:description')}
                >
                    <TextArea
                        placeholder="Role description"
                        rows={6}
                        maxLength={200}
                    />
                </Form.Item>

                <div style={styles.permissionSettingHolder}>
                    <Text strong>{t("role:pageAccess")}</Text>
                    
                    <div style={styles.permissionItemHolder}>
                        {pageAccessPermissions.map((item : PageAccessPermissionData, i : number) => {
                            const isChecked = selectedPageAccessPermission.find(data => data === item.permissionId);
                            
                            return (
                                <div
                                    key={i}
                                    style={styles.pageAccessPermissionItem}
                                >
                                    <Text>{item.permissionName}</Text>
                                    <Switch
                                        checked={isChecked !== undefined}
                                        onChange={e => {
                                            handleTogglePageAccessPermission(item.permissionId, e)
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div style={styles.permissionSettingHolder}>
                    <Text strong>{t("role:permissions")}</Text>

                    <div style={styles.permissionItemHolder}>
                        {permissions.map((item : PermissionData, i : number) => {
                            const existingPermission = selectedPermission.find(
                                perm => perm.permissionId === item.permissionId
                            );

                            return (
                                <div
                                    key={i}
                                    style={styles.permissionItem}
                                >
                                    <Text>{item.permissionName}</Text>
                                    <div style={styles.permissionItemContent}>
                                        <div style={styles.readWriteHolder}>
                                            <Switch
                                                style={{ marginRight: '10px' }}
                                                checked={existingPermission?.read || false}
                                                onChange={(checked) => handleTogglePermission(item.permissionId, checked, 'read')}
                                            />
                                            <Text>{t('global:read')}</Text>
                                        </div>
                                        <div style={styles.readWriteHolder}>
                                            <Switch
                                                style={{ marginRight: '10px'}}
                                                checked={existingPermission?.write || false}
                                                onChange={(checked) => handleTogglePermission(item.permissionId, checked, 'write')}
                                            />
                                            <Text>{t('global:write')}</Text>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

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
    modalHolder : {
        marginTop: '2rem',
        marginBottom: '2rem'
    },
    permissionSettingHolder : {
        marginTop: '2rem'
    },

    submitBtnHolder : {
        marginBottom: '0px',
        marginTop: '2rem',
        flex: 1,
        justifyContent: 'center',
        display: 'flex'
    },
    permissionItemHolder : {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '15px',
        marginTop: '1rem'
    },
    pageAccessPermissionItem : {
        width: '49%',
        padding: '10px 15px',
        border: '1px solid lightgray',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    permissionItem : {
        width: '49%',
        padding: '10px 15px',
        border: '1px solid lightgray',
        borderRadius: '10px',
    },
    permissionItemContent : {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    readWriteHolder : {
        width: '49%',
        display: 'flex',
        alignItems: 'center',
    }
}