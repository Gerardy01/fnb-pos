import { Skeleton, Typography, Input, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { SalesTypeTableData, useSalesTypeManagement } from '../hooks/salesType/useSalesTypeManagement';
import { useTranslation } from "react-i18next";

// components
import AddSalesTypeModal from '../components/salesType/AddSalesTypeModal';

const { Title } = Typography;
const { Search } = Input;



export default function SalesTypeManagement() {

    const { t } = useTranslation(['global', 'salesType']);

    const {
        contentLoad,
        columns,
        salesTypes,
        searchWord,
        addSalesTypeModal,
        editSalesTypeModal,
        outletSelection,
        gratuityOption,
        handleSearch,
        addSalesTypeOpen,
        editSalesTypeOpen,
        onAddSalesTypeSuccess,
        onEditSalesTypeSuccess,
        onDeleteSalesTypeSuccess
    } = useSalesTypeManagement();

    return (
        <div>
            <Title level={3}>{t("salesType:salesTypeManagement")}</Title>
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
                        placeholder={t("salesType:salesTypeSearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={() => addSalesTypeOpen(true)}
                        >
                            {t("salesType:newSalesType")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<SalesTypeTableData> columns={columns} dataSource={salesTypes} size='middle' loading={contentLoad} />
            {outletSelection && gratuityOption && (
                <AddSalesTypeModal
                    open={addSalesTypeModal}
                    outletSelection={outletSelection}
                    gratuityOption={gratuityOption}
                    onClose={() => addSalesTypeOpen(false)}
                    onAddSalesTypeSuccess={onAddSalesTypeSuccess}
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