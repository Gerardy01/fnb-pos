import { Button, Modal, Switch, Typography } from "antd";

import { useTranslation } from "react-i18next";

// types and interfaces
import { OutletSelectionData } from "../../models/accountInterface";
interface Props {
    open : boolean;
    outletSelection : OutletSelectionData[];
    tempSelectedOutlet : OutletSelectionData[];
    onClose : () => void;
    handleSelectOutlet : (outletId : string, isSelected : boolean) => void;
    handleAssignSelectedOutlet : () => void;
    handleSelectAllOutletTemp : (selectAll : boolean) => void;
}

const { Text } = Typography


export default function AssignOutletModal({
    open,
    outletSelection,
    tempSelectedOutlet,
    onClose,
    handleSelectOutlet,
    handleAssignSelectedOutlet,
    handleSelectAllOutletTemp,
} : Props) {

    const { t } = useTranslation(["account", "global"]);

    return (
        <Modal
            title={t('account:assignOutlets')}
            centered
            open={open}
            onCancel={() => {
                onClose();
            }}  
            footer={null}
            style={styles.modalHolder}
        >
            <div style={styles.selectAllHolder}>
                <Text style={styles.selectAllText}>{t("account:outletList")}</Text>
                <div>
                    <Text style={styles.selectAllText}>{t("global:selectAll")}</Text>
                    <Switch
                        checked={tempSelectedOutlet.length === outletSelection.length}
                        size="small"
                        onChange={e => {
                            handleSelectAllOutletTemp(e);
                        }}
                    />
                </div>
            </div>
            {outletSelection.map((item, i) => {
                const isChecked = tempSelectedOutlet.find(outlet => outlet.outletId === item.outletId);
                return (
                    <div
                        key={i}
                        style={styles.outletItem}
                    >
                        <Text>{item.outletName}</Text>
                        <Switch
                            checked={isChecked !== undefined}
                            size="small"
                            onChange={e => {
                                handleSelectOutlet(item.outletId, e);
                            }}
                        />
                    </div>
                )
            })}
            <div style={styles.buttonHolder}>
                <Button
                    type="primary"
                    onClick={handleAssignSelectedOutlet}
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
    selectAllHolder : {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        marginTop: '1rem',
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
    }
}