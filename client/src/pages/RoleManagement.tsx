import { Skeleton, Typography, Input, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { useRoleManagement, RoleTableData } from '../hooks/roles/useRoleManagement';

// components
import AddRoleModal from '../components/role/AddRoleModal';
import EditRoleModal from '../components/role/EditRoleModal';

const { Title } = Typography;
const { Search } = Input;

export default function RoleManagement() {

    const { t } = useTranslation("role");

    const {
        addRoleModal,
        editRoleModal,
        contentLoad,
        columns,
        roles,
        permissions,
        pageAccessPermissions,
        roleIdFormParams,
        searchWord,
        handleSearch,
        openAddRole,
        openEditRole,
        onAddRoleSuccess,
        onEditRoleSuccess,
        onDeleteRoleSuccess,
    } = useRoleManagement();

    return (
        <div>
            <Title level={3}>{t("roleManagement")}</Title>
            {contentLoad ? (
                <div style={styles.controlSection}>
                    <div style={styles.skeletonInput}>
                        <Skeleton.Input active size="large" block />
                    </div>

                    <div style={styles.rightSide}>
                        <Skeleton.Button active size="large" style={styles.skeletonbtn}/>
                    </div>
                </div>
            ) : (
                <div style={styles.controlSection}>
                    <Search
                        style={styles.searchInput}
                        size='large'
                        allowClear
                        value={searchWord}
                        placeholder={t("roleSearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={() => openAddRole(true)}
                        >
                            {t("newRole")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<RoleTableData> columns={columns} dataSource={roles} size='middle' loading={contentLoad} />
            <AddRoleModal
                open={addRoleModal}
                permissions={permissions}
                pageAccessPermissions={pageAccessPermissions}
                onClose={() => openAddRole(false)}
                onAddRoleSuccess={onAddRoleSuccess}
            />
            {roleIdFormParams && (
                <EditRoleModal
                    open={editRoleModal}
                    permissions={permissions}
                    pageAccessPermissions={pageAccessPermissions}
                    onClose={() => openEditRole(false)}
                    onEditRoleSuccess={onEditRoleSuccess}
                    onDeleteRoleSuccess={onDeleteRoleSuccess}
                />
            )}
        </div>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    controlSection : {
        width: '100%',
        marginTop: '3rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchInput : {
        maxWidth: '420px',
        flex: '1'
    },
    rightSide : {
        display: 'flex',
        alignItems: 'center'
    },
    selectionInput : {
        width: '350px',
        margin: '0px 1rem'
    },
    skeletonbtn : {
        width: '140px'
    },
    skeletonInput : {
        minWidth: '40%'
    }
}