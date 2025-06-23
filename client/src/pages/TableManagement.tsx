import { Skeleton, Typography, Input, Button, Table, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { TablesTableData, useTableManagement } from '../hooks/tables/useTableManagement';

// components
import AddTableModal from '../components/table/AddTableModal';



const { Title, Text } = Typography;
const { Search } = Input;


export default function TableManagement() {

    const { t } = useTranslation(['global', 'table']);

    const {
        contentLoad,
        outletSelection,
        selectedOutlet,
        tableGroupSelection,
        selectedTableGroup,
        getTableGroupLoad,
        getTableLoad,
        statusOptions,
        columns,
        tables,
        addTableModal,
        handleChangeOutlet,
        handleChangeTableGroup,
        handleSearch,
        handleChangeStatusFilter,
        addTableModalOpen,
        onAddTableSuccess,
    } = useTableManagement();

    return (
        <div>
            <Title level={3}>{t("table:tableManagement")}</Title>
            {contentLoad ? (
                <div style={styles.controlSection}>
                    <div style={styles.topControl}>
                        <div style={styles.skeletonInput}>
                            <Skeleton.Input active size="large" block />
                        </div>

                        <div style={styles.rightSide}>
                            <Skeleton.Input active size="large" style={styles.selectionInput}/>
                            <Skeleton.Button active size="large" style={styles.skeletonbtn}/>
                        </div>
                    </div>
                    <div style={{...styles.botControl, ...styles.skeletonInputBotHolder}}>
                        <Skeleton.Input active style={styles. botSelectionItemHolder} />
                        <Skeleton.Input active style={{ ...styles.botSelectionItemHolder, ...styles.marginLeft }} />
                    </div>
                </div>
            ) : (
                <div style={styles.controlSection}>
                    <div style={styles.topControl}>
                        <Search
                            style={styles.searchInput}
                            size='large'
                            allowClear
                            placeholder={t("table:tableSearchPlaceholder")}
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
                                onClick={() => addTableModalOpen(true)}
                                disabled={!selectedOutlet || !selectedTableGroup || getTableGroupLoad || getTableLoad}
                            >
                                {t("table:addTable")}
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
                                disabled={getTableGroupLoad || getTableLoad}
                            />
                        </div>
                        <div style={{...styles.botSelectionItemHolder, ...styles.marginLeft}}>
                            <Text>{t("table:selectTableGroup")}</Text>
                            <Select
                                style={styles.botSelectionItem}
                                placeholder={t("table:tableSelection")}
                                options={tableGroupSelection}
                                value={selectedTableGroup ? selectedTableGroup : null}
                                onChange={handleChangeTableGroup}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                                disabled={getTableGroupLoad || getTableLoad}
                                loading={getTableGroupLoad}
                            />
                        </div>
                    </div>
                </div>
            )}
            <Table<TablesTableData> columns={columns} dataSource={tables} size='middle' loading={contentLoad || getTableGroupLoad || getTableLoad} />
            <AddTableModal
                open={addTableModal}
                selectedTableGroup={selectedTableGroup ?? -1}
                onClose={() => addTableModalOpen(false)}
                onAddTableSuccess={onAddTableSuccess}
            />
        </div>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    controlSection : {
        width: '100%',
        marginTop: '3rem',
        marginBottom: '2rem',
    },
    topControl : {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    botControl : {
        width: '100%',
        display: 'flex',
    },
    searchInput : {
        maxWidth: '420px',
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
    },
    marginLeft : {
        marginLeft : '20px'
    },
    skeletonInputBotHolder : {
        marginTop: '50px'
    }
}