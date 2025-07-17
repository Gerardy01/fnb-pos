import { Modal, Form, Input, Button, InputNumber } from "antd";

import { useTranslation } from "react-i18next";
import { useEditTax } from "../../hooks/taxes/useTaxManagement";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";
import AssignOutletModal from "../global/AssignOutletModal";
import AssignedOutletList from "../global/AssignedOutletList";

// types and interfaces
import { OutletSelectionData } from "../../models/globalInterface";
import { TaxCompleteDataReturn } from "../../models/taxInterface";
import { DeleteFilled } from "@ant-design/icons";
interface Props {
    open : boolean;
    outletSelection : OutletSelectionData[];
    onClose : () => void;
    onEditTaxSuccess : (newValue : TaxCompleteDataReturn) => void,
    onDeleteTaxSuccess : (taxId : number) => void,
}


export default function EditTaxModal({
    open,
    outletSelection,
    onClose,
    onEditTaxSuccess,
    onDeleteTaxSuccess,
} : Props) {
    
    const { t } = useTranslation(["global", "tax"]);
    const {
        taxData,
        loading,
        submitLoad,
        contentLoad,
        assignOutletModal,
        editTaxForm,
        selectedOutlet,
        resetData,
        openAssignOutletModal,
        handleAssignSelectedOutlet,
        handleEditTax,
        clickDeleteBtn,
    } = useEditTax(outletSelection, onEditTaxSuccess, onDeleteTaxSuccess);

    return (
        <Modal
            title={t("tax:editTax")}
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
            ) : !contentLoad && taxData ? (
                <>
                    <Form
                        name="editTax"
                        onFinish={handleEditTax}
                        autoComplete="off"
                        layout='vertical'
                        style={styles.form}
                        form={editTaxForm}
                    >
                        <div style={styles.twoItemHolder}>
                            <Form.Item
                                name="name"
                                label={t('gratuity:name')}
                                required
                                initialValue={taxData.name}
                                rules={[
                                    { required: true, message: t("global:fieldRequired") }
                                ]}
                                style={styles.twoFormItem}
                            >
                                <Input
                                    placeholder={t('gratuity:name')}
                                    maxLength={100}
                                />
                            </Form.Item>
                            <Form.Item
                                name="writtenName"
                                label={t('gratuity:writtenName')}
                                required
                                initialValue={taxData.writtenName}
                                rules={[
                                    { required: true, message: t("global:fieldRequired") }
                                ]}
                                tooltip={t("gratuity:writtenNameInfo")}
                                style={styles.twoFormItem}
                            >
                                <Input
                                    placeholder={t('gratuity:writtenName')}
                                    maxLength={100}
                                />
                            </Form.Item>
                        </div>
                        <div style={styles.twoItemHolder}>
                            <Form.Item
                                name="amount"
                                label={t('gratuity:amount')}
                                required
                                initialValue={taxData.amount}
                                rules={[
                                    { required: true, message: t("global:fieldRequired") }
                                ]}
                                style={styles.twoFormItem}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    placeholder={t('gratuity:amount')}
                                    prefix={"%"}
                                    style={styles.numberInput}
                                />
                            </Form.Item>
                        </div>

                        <div style={styles.assignationHolder}>
                            <AssignedOutletList
                                selectedOutlet={selectedOutlet}
                                openAssignOutletModal={openAssignOutletModal}
                                description={t("tax:assignOutletDesc")}
                                isOptional
                            />
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
    assignationHolder: {
        marginBottom: '2rem',
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
    twoItemHolder: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    twoFormItem: {
        width: '48.7%'
    },
    numberInput : {
        width: '100%'
    },
    notContentHolder : {
        height: '30rem',
    },
}