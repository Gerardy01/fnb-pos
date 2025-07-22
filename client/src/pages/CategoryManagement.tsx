import { Skeleton, Typography, Input, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";
import { CategoryTableData, useCategoryManagement } from '../hooks/categories/useCategoryManagement';

// components
import AddCategoryModal from '../components/category/AddCategoryModal';
import EditCategoryModal from '../components/category/EditCategoryModal';


const { Title } = Typography;
const { Search } = Input;


export default function CategoryManagement() {

    const { t } = useTranslation(['global', 'category']);

    const {
        contentLoad,
        searchWord,
        categories,
        columns,
        addCategoryModal,
        editCategoryModal,
        handleSearch,
        addCategoryOpen,
        editCategoryOpen,
        onAddCategorySuccess,
        onEditCategorySuccess,
        onDeleteCategorySuccess,
    } = useCategoryManagement();

    return (
        <div>
            <Title level={3}>{t("category:categoryManagement")}</Title>
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
                        placeholder={t("category:categorySearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={() => addCategoryOpen(true)}
                        >
                            {t("category:newCategory")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<CategoryTableData> columns={columns} dataSource={categories} size='middle' loading={contentLoad} />
            <AddCategoryModal
                open={addCategoryModal}
                onClose={() => addCategoryOpen(false)}
                onAddCategorySuccess={onAddCategorySuccess}
            />
            {editCategoryModal && (
                <EditCategoryModal
                    open={editCategoryModal}
                    onClose={() => editCategoryOpen(false)}
                    onEditCategorySuccess={onEditCategorySuccess}
                    onDeleteCategorySuccess={onDeleteCategorySuccess}
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