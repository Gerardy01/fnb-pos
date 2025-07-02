import { Skeleton, Typography, Input, Button, Table, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { useOutletManagement } from '../hooks/outlets/useOutletManagement';

// components
import AddOutletModal from '../components/outlet/AddOutletModal';
import EditOutletModal from '../components/outlet/EditOutletModal';

// types and interfaces
import { OutletTableData } from '../hooks/outlets/useOutletManagement';

const { Title } = Typography;
const { Search } = Input;

export default function OutletManagement() {

    const { t } = useTranslation(['outlet', 'global']);

    const {
        contentLoad,
        statusOptions,
        columns,
        outlets,
        addOutletModal,
        editOutletModal,
        outletIdFormParams,
        searchWord,
        statusFilterData,
        handleSearch,
        handleChangeStatusFilter,
        addOutletOpen,
        editOutletOpen,
        onAddOutletSuccess,
        onEditOutletSuccess,
        onDeleteOutletSuccess,
        onChangeStatusSuccess,
    } = useOutletManagement();

    return (
        <div>
            <Title level={3}>{t("outlet:outletManagement")}</Title>
            {contentLoad ? (
                <div style={styles.controlSection}>
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
                    <Search
                        style={styles.searchInput}
                        size='large'
                        allowClear
                        value={searchWord}
                        placeholder={t("outlet:outletSearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Select
                            style={styles.selectionInput}
                            size='large'
                            placeholder={t("outlet:statusFilter")}
                            allowClear
                            value={statusFilterData}
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
                            onClick={() => addOutletOpen(true)}
                        >
                            {t("outlet:newOutlet")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<OutletTableData> columns={columns} dataSource={outlets} size='middle' loading={contentLoad} />
            <AddOutletModal
                open={addOutletModal}
                onClose={() => addOutletOpen(false)}
                onAddOutletSuccess={onAddOutletSuccess}
            />
            {outletIdFormParams && (
                <EditOutletModal
                    open={editOutletModal}
                    onClose={() => editOutletOpen(false)}
                    onEditOutletSuccess={onEditOutletSuccess}
                    onDeleteOutletSuccess={onDeleteOutletSuccess}
                    onChangeStatusSuccess={onChangeStatusSuccess}
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