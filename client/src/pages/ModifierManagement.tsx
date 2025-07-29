import { Skeleton, Typography, Input, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { ModifierTableData, useModifierManagement } from '../hooks/modifiers/useModifiermanagement';

// components
import AddModifierModal from '../components/modifier/AddModifierModal';

const { Title } = Typography;
const { Search } = Input;



export default function ModifierManagement() {

    const { t } = useTranslation(['global', 'modifier']);

    const {
        contentLoad,
        searchWord,
        modifiers,
        columns,
        addModifierModal,
        editModifierModal,
        handleSearch,
        addModifierOpen,
        editModifierOpen, 
        onAddModifierSuccess,
        onEditModifierSuccess,
        onDeleteModifierSuccess,
    } = useModifierManagement();

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
                        placeholder={t("modifier:modifierSearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={() => addModifierOpen(true)}
                        >
                            {t("modifier:newModifier")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<ModifierTableData> columns={columns} dataSource={modifiers} size='middle' loading={contentLoad} />
            <AddModifierModal
                open={addModifierModal}
                onClose={() => addModifierOpen(false)}
                onAddModifierSuccess={onAddModifierSuccess}
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