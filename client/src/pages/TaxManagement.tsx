import { Skeleton, Typography, Input, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { TaxTableData, useTaxManagement } from '../hooks/taxes/useTaxManagement';

// components
import AddTaxModal from '../components/tax/AddTaxModal';

// types and interfaces
import EditTaxModal from '../components/tax/EditTaxModal';

const { Title } = Typography;
const { Search } = Input;



export default function TaxManagement() {

    const { t } = useTranslation(['global', 'tax']);

    const {
        contentLoad,
        searchWord,
        taxes,
        columns,
        outletSelection,
        addTaxModal,
        editTaxModal,
        handleSearch,
        addTaxOpen,
        editTaxOpen,
        onAddTaxSuccess,
        onEditTaxSuccess,
        onDeleteTaxSuccess,
    } = useTaxManagement();

    return (
        <div>
            <Title level={3}>{t("tax:taxManagement")}</Title>
            {contentLoad ? (
                <div style={styles.controlSection}>
                    <div style={styles.skeletonInput}>
                        <Skeleton.Input active size="large" block />
                    </div>

                    <div style={styles.rightSide}>
                        <Skeleton.Input active size="large" style={styles.selectionInput}/>
                    </div>
                </div>
            ) : (
                <div style={styles.controlSection}>
                    <Search
                        style={styles.searchInput}
                        size='large'
                        allowClear
                        value={searchWord}
                        placeholder={t("tax:taxSearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={() => addTaxOpen(true)}
                        >
                            {t("tax:newTax")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<TaxTableData> columns={columns} dataSource={taxes} size='middle' loading={contentLoad} />
            <AddTaxModal
                open={addTaxModal}
                outletSelection={outletSelection}
                onClose={() => addTaxOpen(false)}
                onAddTaxSuccess={onAddTaxSuccess}
            />
            {editTaxModal && (
                <EditTaxModal
                    open={editTaxModal}
                    outletSelection={outletSelection}
                    onClose={() => editTaxOpen(false)}
                    onEditTaxSuccess={onEditTaxSuccess}
                    onDeleteTaxSuccess={onDeleteTaxSuccess}
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