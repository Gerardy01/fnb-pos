import { Button, Form, Input, InputNumber, Modal } from "antd";
import { DeleteFilled } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { TablesTableData, useEditTable } from "../../hooks/tables/useTableManagement";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
    onEditTableSuccess : (newData : TablesTableData) => void;
    onChangeStatusSuccess : (tableId : number, newStatus : boolean) => void;
    onDeleteTableSuccess : (tableId : number) => void;
}

export default function EditTableModal({
    open,
    onClose,
    onEditTableSuccess,
    onChangeStatusSuccess,
    onDeleteTableSuccess,
} : Props) {

    const { t } = useTranslation(["global", "table"]);

    const {
        contentLoad,
        submitLoad,
        loading,
        tableData,
        editTableForm,
        handleEditTable,
        handleChangeStatus,
        clickDeleteBtn,
    } = useEditTable(onEditTableSuccess, onChangeStatusSuccess, onDeleteTableSuccess);

    return (
        <Modal
            title={t("table:editTable")}
            centered
            open={open}
            onCancel={() => {
                onClose();
            }}
            footer={null}
            maskClosable={false}
        >
            {contentLoad ? (
                <div style={styles.notContentHolder}>
                    <ContentLoading />
                </div>
            ) : !contentLoad && tableData ? (
                <Form
                    name="editTable"
                    onFinish={handleEditTable}
                    autoComplete="off"  
                    layout='vertical'
                    style={styles.form}
                    form={editTableForm}
                >
                    <Form.Item
                        name="tableName"
                        label={t('table:tableName')}
                        required
                        initialValue={tableData.tableName}
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
                        initialValue={tableData.pax}
                        rules={[
                            { required: true, message: t("global:fieldRequired") }
                        ]}
                    >
                        <InputNumber
                            min={0}
                            max={9999}
                            placeholder="00"
                            style={styles.numberInput}
                        />
                    </Form.Item>

                    <div style={styles.submitBtnHolder}>
                        <div>
                            <Button
                                type="primary"
                                variant="solid"
                                size="large"
                                color="danger"
                                disabled={submitLoad || loading}
                                onClick={clickDeleteBtn}
                                icon={<DeleteFilled />}
                            >
                                {t("global:delete")}
                            </Button>
                            <Button

                                type="primary"
                                variant="solid"
                                size="large"
                                danger={tableData.status}
                                style={{
                                    ...styles.deactivateBtn,
                                    backgroundColor: tableData.status ? undefined : '#52c41a',
                                    borderColor: tableData.status ? undefined : '#52c41a',
                                }}
                                onClick={() => handleChangeStatus(!tableData.status)}
                                disabled={submitLoad}
                                loading={loading}
                            >
                                {tableData.status ? t("global:deactivate") : t("global:activate")}
                            </Button>
                        </div>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={submitLoad}
                                disabled={loading}
                            >
                                {t("global:submit")}
                            </Button>
                        </Form.Item>
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
        marginBottom: '0px',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
    notContentHolder : {
        height: '14rem',
    },
    deactivateBtn : {
        marginLeft: '10px'
    },
    numberInput : {
        width : '100%'
    }
}