import { Skeleton, Typography, Input, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { useRoleManagement, RoleTableData } from '../hooks/roles/useRoleManagement';

// components
import AddRoleModal from '../components/role/AddRoleModal';

const { Title } = Typography;
const { Search } = Input;

export default function RoleManagement() {

    const { t } = useTranslation("role");

    const {
        addRoleModal,
        contentLoad,
        columns,
        roles,
        permissions,
        pageAccessPermissions,
        handleSearch,
        openAddRole,
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
                        placeholder={t("accountSearchPlaceholder")}
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
            />
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
        maxWidth: '40%',
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