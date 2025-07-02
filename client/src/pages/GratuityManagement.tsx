import { Skeleton, Typography, Input, Button, Table, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { useGratuityManagement, GratuityTableData } from '../hooks/gratuities/useGratuityManagement';

// components
import AddGratuityModal from '../components/gratuity/AddGratuityModal';


const { Title } = Typography;
const { Search } = Input;

export default function GratuityManagement() {

    const { t } = useTranslation(['global', 'gratuity']);

    const { 
        contentLoad,
        columns,
        gratuities,
        addGratuityModal,
        editGratuityModal,
        calculationOptions,
        searchWord,
        calculationType,
        handleSearch,
        addGratuityOpen,
        handleChangeCalculationTypeFilter,
        onAddGratuitySuccess,
    } = useGratuityManagement();

    return (
        <div>
            <Title level={3}>{t("gratuity:gratuityManagement")}</Title>
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
                        placeholder={t("gratuity:gratuitySearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Select
                            style={styles.selectionInput}
                            size='large'
                            placeholder={t("gratuity:calculationType")}
                            allowClear
                            value={calculationType}
                            options={calculationOptions}
                            onChange={handleChangeCalculationTypeFilter}
                            filterOption={(input, option) =>
                                (option?.label as string).toLowerCase().includes(input.toLowerCase())
                            }
                        />
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={() => addGratuityOpen(true)}
                        >
                            {t("gratuity:newGratuity")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<GratuityTableData> columns={columns} dataSource={gratuities} size='middle' loading={contentLoad}  />
            <AddGratuityModal
                open={addGratuityModal}
                onClose={() => addGratuityOpen(false)}
                onAddGratuitySuccess={onAddGratuitySuccess}
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