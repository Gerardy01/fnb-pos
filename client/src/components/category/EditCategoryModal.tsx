import { Modal, Form, Input, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { CategoryTableData, useEditCategory } from "../../hooks/categories/useCategoryManagement";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
    onEditCategorySuccess : (newValue : CategoryTableData) => void,
    onDeleteCategorySuccess : (categoryId : number) => void,
}


export default function EditCategoryModal({
    open,
    onClose,
    onEditCategorySuccess,
    onDeleteCategorySuccess,
} : Props) {

    const { t } = useTranslation(["global", "category"]);

    const {
        categoryData,
        loading,
        contentLoad,
        submitLoad,
        editCategoryForm,
        resetData,
        handleEditCategory,
        clickDeleteBtn,
    } = useEditCategory(onEditCategorySuccess, onDeleteCategorySuccess);

    return (
        <Modal
            title={t("category:editCategory")}
            centered
            open={open}
            onCancel={() => {
                onClose();
                resetData();
            }}  
            footer={null}
            maskClosable={false}
            style={styles.modal}
            width={400}
        >
            {contentLoad ? (
                <div style={styles.notContentHolder}>
                    <ContentLoading />
                </div>
            ) : !contentLoad && categoryData ? (
                <Form
                    name="editCategory"
                    onFinish={handleEditCategory}
                    autoComplete="off"  
                    layout='vertical'
                    style={styles.form}
                    form={editCategoryForm}
                >
                    <Form.Item
                        name="name"
                        label={t('gratuity:name')}
                        required
                        initialValue={categoryData.name}
                        rules={[
                            { required: true, message: t("global:fieldRequired") }
                        ]}
                    >
                        <Input
                            placeholder={t('gratuity:name')}
                            maxLength={100}
                        />
                    </Form.Item>

                    <div style={styles.submitBtnHolder}>
                        <Button
                            type="primary"
                            variant="solid"
                            size="large"
                            color="danger"
                            disabled={submitLoad}
                            onClick={clickDeleteBtn}
                            icon={<DeleteFilled />}
                        >
                            {t("global:delete")}
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={submitLoad}
                            disabled={loading}
                        >
                            {t("global:submit")}
                        </Button>
                    </div>
                </Form>
            ) : (
                <div style={styles.notContentHolder}>
                    <ContentNotFound />
                </div>
            )}
        </Modal>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    form : {
        paddingTop: '1rem',
    },
    modal : {
        marginTop: '2rem',
        marginBottom: '2rem'
    },
    submitBtnHolder : {
        width: '100%',
        marginBottom: '1rem',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
    notContentHolder : {
        height: '10rem',
    },
}