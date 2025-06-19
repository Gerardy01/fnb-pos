import { Button, Form, Input, Modal } from "antd";

import { useTranslation } from "react-i18next";
import { TableGroupsTableData, useAddTableGroup } from "../../hooks/tables/useTableGroupManagement";

// types and interfaces
interface Props {
    open : boolean;
    selectedOutlet : string;
    onClose : () => void;
    onAddTableGroupSuccess : (newTableGroup : TableGroupsTableData) => void;
}

export default function AddTableGroupModal({
    open,
    selectedOutlet,
    onClose,
    onAddTableGroupSuccess,
} : Props) {

    const { t } = useTranslation(["global", "table"]);

    const {
        addTableGroupForm,
        loading,
        handleAddTableGroup,
        resetData,
    } = useAddTableGroup(selectedOutlet, onAddTableGroupSuccess);

    return (
        <Modal
            title={t("table:addNewTableGroup")}
            centered
            open={open}
            onCancel={() => {
                onClose();
                resetData();
            }}  
            footer={null}
            maskClosable={false}
            style={styles.modal}
        >
            <Form
                name="addTableGroup"
                onFinish={handleAddTableGroup}
                autoComplete="off"  
                layout='vertical'
                style={styles.form}
                form={addTableGroupForm}
            >
                <Form.Item
                    name="groupName"
                    label={t('table:groupName')}
                    required
                    rules={[
                        { required: true, message: t("global:fieldRequired") }
                    ]}
                >
                    <Input
                        placeholder={t('table:groupName')}
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