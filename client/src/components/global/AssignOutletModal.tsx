import { Button, Input, Modal, Select, Table } from "antd";

import { useTranslation } from "react-i18next";
import useAssignOutletModal from "../../hooks/global/useAssignOutletModal";

// types and interfaces
import { OutletSelectionData } from "../../models/globalInterface";
import { OutletSelectionTableData } from "../../hooks/global/useAssignOutletModal";
interface Props {
    open : boolean;
    outletSelection : OutletSelectionData[];
    selectedOutlet : OutletSelectionData[];
    onClose : () => void;
    handleAssignSelectedOutlet : (tempSelectedOutlet : OutletSelectionData[]) => void;
}

const { Search } = Input;


export default function AssignOutletModal({
    open,
    outletSelection,
    selectedOutlet,
    onClose,
    handleAssignSelectedOutlet,
} : Props) {

    const { t } = useTranslation(["global"]);

    const {
        columns,
        rowSelection,
        tempSelectedOutlet,
        forTableOutletSelection,
        statusOptions,
        handleSearch,
        handleChangeStatusFilter,
    } = useAssignOutletModal(outletSelection, selectedOutlet);

    return (
        <Modal
            title={t('global:assignOutlets')}
            centered
            open={open}
            onCancel={() => {
                onClose();
            }}  
            footer={null}
            style={styles.modalHolder}
            width={600}
        >
            <div style={styles.topContentHolder}>
                <Search
                    style={styles.searchInput}
                    allowClear
                    placeholder={t("oultetSearchPlaceholder")}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Select
                    style={styles.selectionInput}
                    placeholder={t("outlet:statusFilter")}
                    allowClear
                    options={statusOptions}
                    onChange={handleChangeStatusFilter}
                    filterOption={(input, option) =>
                        (option?.label as string).toLowerCase().includes(input.toLowerCase())
                    }
                />
                
            </div>
            <Table<OutletSelectionTableData>
                columns={columns}
                dataSource={forTableOutletSelection}
                size="middle"
                rowSelection={rowSelection}
                pagination={forTableOutletSelection.length > 10 ? undefined : false}
            />
            <div style={styles.buttonHolder}>
                <Button
                    type="primary"
                    onClick={() => handleAssignSelectedOutlet(tempSelectedOutlet)}
                >
                    {t("global:assign")}
                </Button>
            </div>
        </Modal>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    modalHolder : {
        marginTop: '2rem',
        marginBottom: '2rem'
    },
    outletItem : {
        width: '100%',
        padding: '5px 10px',
        borderBottom: '1px solid lightgray',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    topContentHolder : {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        marginTop: '2rem',
        alignItems: 'center',
        marginRight: '10px'
    },
    selectAllText : {
        marginRight: '10px'
    },
    buttonHolder : {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1.5rem'
    },
    searchInput : {
        maxWidth: '300px',
        flex: 1
    },
    selectionInput : {
        width: '200px',
        marginRight: '-8px'
    }
}