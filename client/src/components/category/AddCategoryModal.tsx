import { Button, Form, Input, Modal } from "antd";

import { useTranslation } from "react-i18next";
import { CategoryTableData, useAddCategory } from "../../hooks/categories/useCategoryManagement";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
    onAddCategorySuccess : (newCategory : CategoryTableData) => void;
}

export default function AddCategoryModal({
    open,
    onClose,
    onAddCategorySuccess,
} : Props) {

    const { t } = useTranslation(["global", "category"]);

    const {
        loading,
        addCategoryForm,
        resetData,
        handleAddCategory,
    } = useAddCategory(onAddCategorySuccess);

    return (
        <Modal
            title={t("category:addNewCategory")}
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
            <Form
                name="addCategory"
                onFinish={handleAddCategory}
                autoComplete="off"  
                layout='vertical'
                style={styles.form}
                form={addCategoryForm}
            >
                <Form.Item
                    name="name"
                    label={t('gratuity:name')}
                    required
                    rules={[
                        { required: true, message: t("global:fieldRequired") }
                    ]}
                >
                    <Input
                        placeholder={t('gratuity:name')}
                        maxLength={100}
                    />
                </Form.Item>

                <Form.Item style={styles.submitBtnHolder}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                    >
                        {t("global:submit")}
                    </Button>
                </Form.Item>
            </Form>
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
        marginBottom: '0px',
        marginTop: '2rem',
        flex: 1,
        justifyContent: 'center',
        display: 'flex'
    },
}