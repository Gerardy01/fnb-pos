import { Modal, Form, Input, Button, Typography, Select, SelectProps, Checkbox, Table } from "antd";

import { useTranslation } from "react-i18next";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";
import AssignedOutletList from "../global/AssignedOutletList";
import AssignOutletModal from "../global/AssignOutletModal";

// types and interfaces
import { SalesTypeTableData, useEditSalesType } from "../../hooks/salesType/useSalesTypeManagement";
import { OutletSelectionData } from "../../models/globalInterface";
import { DeleteFilled } from "@ant-design/icons";
interface Props {
    open : boolean;
    outletSelection : OutletSelectionData[];
    gratuityOption : SelectProps['options'];
    onClose : () => void;
    onEditSalesTypeSuccess : (newValue : SalesTypeTableData) => void;
    onDeleteSalesTypeSuccess : (salesTypeId : number) => void,
}

const { Text } = Typography;


export default function EditSalesTypeModal({
    open,
    outletSelection,
    gratuityOption,
    onClose,
    onEditSalesTypeSuccess,
    onDeleteSalesTypeSuccess,
} : Props) {

    const { t } = useTranslation(["global", "gratuity"]);
    const {
        loading,
        submitLoad,
        contentLoad,
        salesTypeData,
        editSalesTypeForm,
        assignOutletModal,
        selectedOutlet,
        selectOutletErrorMsg,
        diffGratuityOutlet,
        selectedGratuities,
        gratuityAssignationCols,
        resetData,
        openAssignOutletModal,
        handleAssignSelectedOutlet,
        handleChangeGratuitySelection,
        changeDiffGratuityOutlet,
        handleEditSalesType,
        clickDeleteBtn,
    } = useEditSalesType(outletSelection, gratuityOption, onEditSalesTypeSuccess, onDeleteSalesTypeSuccess);

    return (
        <Modal
            title={t("salesType:editSalesType")}
            centered
            open={open}
            onCancel={() => {
                onClose();
                resetData();
            }}  
            footer={null}
            maskClosable={false}
            width={700}
            style={styles.modalHolder}
        >
            {contentLoad ? (
                <div style={styles.notContentHolder}>
                    <ContentLoading />
                </div>
            ) : !contentLoad && salesTypeData ? (
                <>
                    <Form
                        name="editSalesType"
                        layout="vertical"
                        form={editSalesTypeForm}
                        style={styles.form}
                        onFinish={handleEditSalesType}
                    >
                        <Form.Item
                            name="name"
                            label={t('salesType:name')}
                            required
                            initialValue={salesTypeData.name}
                            rules={[
                                { required: true, message: t("global:fieldRequired") }
                            ]}
                        >
                            <Input
                                placeholder="e.g Dine in"
                                maxLength={100}
                            />
                        </Form.Item>

                        <div style={styles.assignationHolder}>
                            <AssignedOutletList
                                selectedOutlet={selectedOutlet}
                                openAssignOutletModal={openAssignOutletModal}
                                selectOutletErrorMsg={selectOutletErrorMsg}
                                description={t("salesType:assignOutletDesc")}
                            />
                        </div>

                        <div style={styles.assignationHolder}>
                            <div style={styles.subTitle}>
                                <Text strong>{t("salesType:assignGratuity")} {t("global:optionalPrefix")}</Text>
                                <Text style={styles.description} type="secondary">{t("salesType:assignGratuityDesc")}</Text>
                            </div>
        
                            
                            {diffGratuityOutlet ? (
                                <div style={styles.selectionInputHolder}>
                                    <Table<OutletSelectionData>
                                        columns={gratuityAssignationCols}
                                        dataSource={selectedOutlet}
                                        size="middle"
                                        pagination={selectedOutlet.length > 10 ? undefined : false}
                                    />
                                </div>
                            ) : (
                                <div style={styles.selectionInputHolder}>
                                    <Select
                                        style={styles.selectionInput}
                                        placeholder={t("salesType:selectGratuity")}
                                        mode="multiple" 
                                        allowClear
                                        size='large'
                                        value={selectedGratuities}
                                        options={gratuityOption}
                                        onChange={handleChangeGratuitySelection}
                                        filterOption={(input, option) =>
                                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                    <Text style={styles.description} type="secondary">{t("salesType:appliedToAllOutlet")}</Text>
                                </div>
                            )}
        
                            <Checkbox
                                style={styles.checkbox}
                                checked={diffGratuityOutlet}
                                onChange={(e) => changeDiffGratuityOutlet(e.target.checked)}
                                disabled={selectedOutlet.length <= 1}
                            >{t("salesType:diffGratuityOutletLabel")}</Checkbox>
                        </div>

                        <div style={styles.submitBtnHolder}>
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
                                htmlType="submit"
                                size="large"
                                loading={submitLoad}
                                disabled={loading}
                            >
                                {t("global:submit")}
                            </Button>
                        </div>
                    </Form>
                    
                    {assignOutletModal && (
                        <AssignOutletModal
                            open={assignOutletModal}
                            onClose={() => openAssignOutletModal(false)}
                            outletSelection={outletSelection}
                            selectedOutlet={selectedOutlet}
                            handleAssignSelectedOutlet={handleAssignSelectedOutlet}
                        />
                    )}
                </>
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
    modalHolder : {
        marginTop: '2rem',
        marginBottom: '2rem'
    },
    permissionSettingHolder : {
        marginTop: '2rem'
    },
    submitBtnHolder : {
        width: '100%',
        marginBottom: '1rem',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
    permissionItemHolder : {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '15px',
        marginTop: '1rem'
    },
    pageAccessPermissionItem : {
        width: '49%',
        padding: '10px 15px',
        border: '1px solid lightgray',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    permissionItem : {
        width: '49%',
        padding: '10px 15px',
        border: '1px solid lightgray',
        borderRadius: '10px',
    },
    permissionItemContent : {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    readWriteHolder : {
        width: '49%',
        display: 'flex',
        alignItems: 'center',
    },
    checkBox : {
        marginTop: '2rem',
    },
    alert : {
        marginTop: '1rem',
        marginBottom: '2rem',
        width: '45%',
    },
    assignationHolder: {
        marginBottom: '2rem',
        marginTop: '2rem'
    },
    subTitleHolder: {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subTitle: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%'
    },
    description : {
        fontSize: '12px'
    },
    selectionInput : {
        width : '100%'
    },
    selectionInputHolder : {
        marginTop: '1rem',
    },
    checkbox : {
        marginTop: '1rem'
    },
    notContentHolder : {
        height: '30rem',
    },
}