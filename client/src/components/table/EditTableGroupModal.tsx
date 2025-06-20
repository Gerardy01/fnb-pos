import { Button, Form, Input, Modal } from "antd";

import { useTranslation } from "react-i18next";
import { TableGroupsTableData, useEditTableGroup } from "../../hooks/tables/useTableGroupManagement";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";
import { DeleteFilled } from "@ant-design/icons";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
    onEditTableGroupSuccess : (newData : TableGroupsTableData) => void;
    onChangeStatusSuccess : (tableGroupId : number, newStatus : boolean) => void;
    onDeleteTableGroupSuccess : (tableGroupId : number) => void;
}


export default function EditTableGroupModal({
    open,
    onClose,
    onEditTableGroupSuccess,
    onChangeStatusSuccess,
    onDeleteTableGroupSuccess,
} : Props) {

    const { t } = useTranslation(["global", "table"]);

    const {
        contentLoad,
        tableGroupData,
        editTableGroupForm,
        submitLoad,
        loading,
        handleEditTableGroup,
        handleChangeStatus,
        clickDeleteBtn,
    } = useEditTableGroup(onEditTableGroupSuccess, onChangeStatusSuccess, onDeleteTableGroupSuccess);

    return (
        <Modal
            title={t("table:editTableGorup")}
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
            ) : !contentLoad && tableGroupData ? (
                <Form
                    name="editTableGroup"
                    onFinish={handleEditTableGroup}
                    autoComplete="off"  
                    layout='vertical'
                    style={styles.form}
                    form={editTableGroupForm}
                >
                    <Form.Item
                        name="groupName"
                        label={t('table:groupName')}
                        required
                        initialValue={tableGroupData.groupName}
                        rules={[
                            { required: true, message: t("global:fieldRequired") }
                        ]}
                    >
                        <Input
                            placeholder={t('table:groupName')}
                            maxLength={100}
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
                                danger={tableGroupData.status}
                                style={{
                                    ...styles.deactivateBtn,
                                    backgroundColor: tableGroupData.status ? undefined : '#52c41a',
                                    borderColor: tableGroupData.status ? undefined : '#52c41a',
                                }}
                                onClick={() => handleChangeStatus(!tableGroupData.status)}
                                disabled={submitLoad}
                                loading={loading}
                            >
                                {tableGroupData.status ? t("global:deactivate") : t("global:activate")}
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
        height: '10rem',
    },
    deactivateBtn : {
        marginLeft: '10px'
    }
}