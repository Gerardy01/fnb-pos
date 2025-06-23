import { Button, Form, Input, InputNumber, Modal } from "antd";

import { useTranslation } from "react-i18next";
import { TablesTableData, useAddTable } from "../../hooks/tables/useTableManagement";


// types and interfaces
interface Props {
    open : boolean;
    selectedTableGroup : number;
    onClose : () => void;
    onAddTableSuccess : (newTableGroup : TablesTableData) => void;
}



export default function AddTableModal({
    open,
    selectedTableGroup,
    onClose,
    onAddTableSuccess,
} : Props) {

    const { t } = useTranslation(["global", "table"]);

    const {
        loading,
        addTableForm,
        handleAddTable,
        resetData,
    } = useAddTable(selectedTableGroup, onAddTableSuccess);

    return (
        <Modal
            title={t("table:addNewTable")}
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
                onFinish={handleAddTable}
                autoComplete="off"  
                layout='vertical'
                style={styles.form}
                form={addTableForm}
            >
                <Form.Item
                    name="tableName"
                    label={t('table:tableName')}
                    required
                    rules={[
                        { required: true, message: t("global:fieldRequired") }
                    ]}
                >
                    <Input
                        placeholder={t('table:tableName')}
                        maxLength={100}
                    />
                </Form.Item>

                <Form.Item
                    name="pax"
                    label={t('table:pax')}
                    required
                    rules={[
                        { required: true, message: t("global:fieldRequired") }
                    ]}
                    style={styles.twoFormItem}
                >
                    <InputNumber
                        min={0}
                        max={9999}
                        placeholder="00"
                        style={styles.numberInput}
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
    twoItemHolder: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    twoFormItem: {
        width: '48%'
    },
    numberInput : {
        width: '100%'
    }
}