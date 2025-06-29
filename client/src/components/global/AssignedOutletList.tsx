import { EditOutlined } from "@ant-design/icons"
import { Alert, Button, List, Typography } from "antd"

import { useTranslation } from "react-i18next";
import { OutletSelectionData } from "../../models/globalInterface";

// types and interfaces
interface Props {
    selectOutletErrorMsg? : string;
    selectedOutlet : OutletSelectionData[];
    openAssignOutletModal : (open : boolean) => void;
}

const { Text } = Typography

export default function AssignedOutletList({
    selectedOutlet,
    openAssignOutletModal,
    selectOutletErrorMsg = "",
} : Props) {

    const { t } = useTranslation(["outlet", "global"]);

    return (
        <>
            <div style={styles.subTitleHolder} >
                <Text strong>{t("global:assignOutlets")}</Text>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => openAssignOutletModal(true)}
                >
                    {t("global:assign")}
                </Button>
            </div>
            
            {selectOutletErrorMsg !== "" && (
                <Alert
                    message={t("outlet:noOutletErrMsg")}
                    type="error"
                    showIcon
                    style={styles.alert}
                />
            )}
            <div style={styles.listHolder}>
                <List
                    size="small"
                    dataSource={selectedOutlet}
                    renderItem={(item) => (
                        <List.Item>
                            {item.outletName}
                        </List.Item>
                    )}
                />
            </div>
        </>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    subTitleHolder: {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    alert : {
        width: '100%',
        marginBottom: '1rem'
    },
    listHolder : {
        maxHeight: 220,
        overflow: 'auto',
        border: '1px solid rgba(140, 140, 140, 0.35)',
        borderRadius: '7px'
    },
}