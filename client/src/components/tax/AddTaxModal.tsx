import { Modal, Form, Input, Button, InputNumber } from "antd";

import { useTranslation } from "react-i18next";

// components
import AssignOutletModal from "../global/AssignOutletModal";
import AssignedOutletList from "../global/AssignedOutletList";

// types and interfaces
import { OutletSelectionData } from "../../models/globalInterface";
import { useAddTax } from "../../hooks/taxes/useTaxManagement";
import { TaxCompleteDataReturn } from "../../models/taxInterface";
interface Props {
    open : boolean;
    outletSelection : OutletSelectionData[];
    onClose : () => void;
    onAddTaxSuccess : (newTax : TaxCompleteDataReturn) => void;
}


export default function AddTaxModal({
    open,
    outletSelection,
    onClose,
    onAddTaxSuccess,
} : Props) {

    const { t } = useTranslation(["global", "tax"]);
    const {
        loading,
        addTaxForm,
        assignOutletModal,
        selectedOutlet,
        resetData,
        openAssignOutletModal,
        handleAssignSelectedOutlet,
        handleAddSalesType,
    } = useAddTax(onAddTaxSuccess);
    
    return (
        <Modal
            title={t("tax:addNewTax")}
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
            <Form
                name="addTax"
                onFinish={handleAddSalesType}
                autoComplete="off"
                layout='vertical'
                style={styles.form}
                form={addTaxForm}
            >
                <div style={styles.twoItemHolder}>
                    <Form.Item
                        name="name"
                        label={t('gratuity:name')}
                        required
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

                <Form.Item
                    style={styles.submitBtnHolder}
                >
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
            {assignOutletModal && (
                <AssignOutletModal
                    open={assignOutletModal}
                    onClose={() => openAssignOutletModal(false)}
                    outletSelection={outletSelection}
                    selectedOutlet={selectedOutlet}
                    handleAssignSelectedOutlet={handleAssignSelectedOutlet}
                />
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
        marginBottom: '0px',
        marginTop: '2rem',
        flex: 1,
        justifyContent: 'center',
        display: 'flex'
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
        width: '48%'
    },
    numberInput : {
        width: '100%'
    },
}