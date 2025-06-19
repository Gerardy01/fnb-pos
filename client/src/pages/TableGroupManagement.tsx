import { Skeleton, Typography, Input, Button, Table, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { useTableGroupManagement } from '../hooks/tables/useTableGroupManagement';

// components
import AddTableGroupModal from '../components/table/AddTableGroupModal';
import EditTableGroupModal from '../components/table/EditTableGroupModal';

// types and interfaces
import { TableGroupsTableData } from '../hooks/tables/useTableGroupManagement';

const { Title, Text } = Typography;
const { Search } = Input;


export default function TableGroupManagement() {

    const { t } = useTranslation(['global', 'table']);

    const { 
        contentLoad,
        outletSelection,
        selectedOutlet,
        statusOptions,
        columns,
        tableGroups,
        getTableGroupLoad,
        addTableGroupModal,
        editTableGroupModal,
        handleChangeOutlet,
        addTableGroupModalOpen,
        editTableGroupModalOpen,
        handleChangeStatusFilter,
        handleSearch,
        onAddTableGroupSuccess,
        onEditTableGroupSuccess,
    } = useTableGroupManagement();

    return (
        <div>
            <Title level={3}>{t("table:tableGroupManagement")}</Title>
            {contentLoad ? (
                <div style={styles.controlSectionSkeleton}>
                    <div style={styles.skeletonInput}>
                        <Skeleton.Input active size="large" block />
                    </div>

                    <div style={styles.rightSide}>
                        <Skeleton.Input active size="large" style={styles.selectionInput}/>
                        <Skeleton.Button active size="large" style={styles.skeletonbtn}/>
                    </div>
                </div>    
            ) : (
                <div style={styles.controlSection}>
                    <div style={styles.topControl}>
                        <Search
                            style={styles.searchInput}
                            size='large'
                            allowClear
                            placeholder={t("table:tableGroupSearchPlaceholder")}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div style={styles.rightSide}>
                            <Select
                                style={styles.selectionInput}
                                size='large'
                                placeholder={t("outlet:statusFilter")}
                                allowClear
                                options={statusOptions}
                                onChange={handleChangeStatusFilter}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                            <Button
                                type="primary"
                                size='large'
                                icon={<PlusOutlined />}
                                onClick={() => addTableGroupModalOpen(true)}
                                disabled={!selectedOutlet || getTableGroupLoad}
                            >
                                {t("table:addTableGroup")}
                            </Button>
                        </div>
                    </div>
                    <div style={styles.botControl}>
                        <div style={styles.botSelectionItemHolder}>
                            <Text>{t("table:selectOutlet")}</Text>
                            <Select
                                style={styles.botSelectionItem}
                                placeholder={t("table:outletSelection")}
                                options={outletSelection}
                                value={selectedOutlet ? selectedOutlet : null}
                                onChange={handleChangeOutlet}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
            <Table<TableGroupsTableData> columns={columns} dataSource={tableGroups} size='middle' loading={contentLoad || getTableGroupLoad} />
            <AddTableGroupModal
                open={addTableGroupModal}
                selectedOutlet={selectedOutlet}
                onClose={() => addTableGroupModalOpen(false)}
                onAddTableGroupSuccess={onAddTableGroupSuccess}
            />
            {editTableGroupModal && (
                <EditTableGroupModal
                    open={editTableGroupModal}
                    onClose={() => editTableGroupModalOpen(false)}
                    onEditTableGroupSuccess={onEditTableGroupSuccess}
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
    },
    controlSectionSkeleton : {
        width: '100%',
        marginTop: '3rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topControl : {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    botControl : {
        width: '100%',
    },
    searchInput : {
        maxWidth: '400px',
        flex: '1'
    },
    botSelectionItemHolder : {
        maxWidth: '200px',
        flex: '1',
    }, 
    botSelectionItem : {
        width: '100%',
        marginTop: '5px',
    },
    rightSide : {
        display: 'flex',
        alignItems: 'center'
    },
    selectionInput : {
        width: '250px',
        margin: '0px 1rem'
    },
    skeletonbtn : {
        width: '140px'
    },
    skeletonInput : {
        minWidth: '40%'
    }
}