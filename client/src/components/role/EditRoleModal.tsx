import { Alert, Button, Checkbox, Form, Input, Modal, Switch, Typography } from "antd";
import { DeleteFilled } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { RoleTableData, useEditRole } from "../../hooks/roles/useRoleManagement";

// types and interfaces
import { PageAccessPermissionData, PermissionData } from "../../models/permissionInterface";
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";
interface Props {
    open : boolean;
    permissions : PermissionData[];
    pageAccessPermissions : PageAccessPermissionData[];
    onClose : () => void;
    onEditRoleSuccess : (roleId : number, roleData : RoleTableData) => void;
    onDeleteRoleSuccess : (roleId : number) => void;
}

const { TextArea } = Input;
const { Text } = Typography;

export default function EditRoleModal({
    open,
    permissions,
    pageAccessPermissions,
    onClose,
    onEditRoleSuccess,
    onDeleteRoleSuccess,
} : Props) {

    const { t } = useTranslation(["global", "role"]);

    const {
        editRoleForm,
        selectedPermission,
        selectedPageAccessPermission,
        isAdvanced,
        pageAccessPermissionErrorMsg,
        permissionErrorMsg,
        getOneRoleLoad,
        selectedRoleData,
        submitLoad,
        resetData,
        submitEditRole,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        handleSetAdvanced,
        clickDeleteBtn,
    } = useEditRole(onEditRoleSuccess, onDeleteRoleSuccess);

    return (
        <Modal
            title={t("role:editRole")}
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
            {getOneRoleLoad ? (
                <div
                    style={styles.notContentHolder}
                >
                    <ContentLoading />
                </div>

            ) : !getOneRoleLoad && selectedRoleData ? (
                <Form
                    name="editRole"
                    layout="vertical"
                    form={editRoleForm}
                    style={styles.form}
                    onFinish={submitEditRole}
                >
                    <Form.Item
                        name="roleName"
                        label={t('role:roleName')}
                        required
                        initialValue={selectedRoleData.roleName}
                        rules={[
                            { required: true, message: t("global:fieldRequired") },
                            {
                                max: 50,
                                message: t("account:NAME01"),
                            },
                        ]}
                    >
                        <Input
                            placeholder="role name"
                            maxLength={50}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={t('global:description')}
                        initialValue={selectedRoleData.description}
                    >
                        <TextArea
                            placeholder="Role description"
                            rows={6}
                            maxLength={200}
                        />
                    </Form.Item>
                    
                    <div style={styles.permissionSettingHolder}>
                        <div style={styles.subTitle}>
                            <Text strong>{t("role:pageAccess")}</Text>
                            <Text style={styles.description} type="secondary">{t("role:selectPermissionDesc")}</Text>
                        </div>

                        {pageAccessPermissionErrorMsg && (
                            <Alert
                                message={pageAccessPermissionErrorMsg}
                                type="error"
                                showIcon
                                style={styles.alert}
                            />
                        )}
                        
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

                    <Checkbox
                        style={styles.checkBox}
                        onChange={e => handleSetAdvanced(e.target.checked)}
                        checked={isAdvanced}
                    >{t("global:advanced")}</Checkbox>

                    {isAdvanced && (
                        <div style={styles.permissionSettingHolder}>
                            <Text strong>{t("role:permissions")}</Text>

                            {permissionErrorMsg && (
                                <Alert
                                    message={permissionErrorMsg}
                                    type="error"
                                    showIcon
                                    style={styles.alert}
                                />
                            )}

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
                    )}

                    <Form.Item>
                        <div style={styles.submitBtnHolder}>
                            <Button
                                type="primary"
                                variant="solid"
                                size="large"
                                color="danger"
                                disabled={submitLoad}
                                onClick={clickDeleteBtn}
                                icon={<DeleteFilled />}
                            >
                                {t("global:delete")}
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={submitLoad}
                            >
                                {t("global:submit")}
                            </Button>
                        </div>
                    </Form.Item>
                    
                </Form>
            ) : (
                <div style={styles.notContentHolder}>
                    <ContentNotFound />
                </div>
            )}
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
        width: '100%',
        marginBottom: '0px',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
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
    },
    checkBox : {
        marginTop: '2rem',
    },
    alert : {
        marginTop: '1rem',
        marginBottom: '2rem',
        width: '45%',
    },
    notContentHolder : {
        height: '35rem'
    },
    subTitle: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80%'
    },
    description : {
        fontSize: '12px'
    }
}