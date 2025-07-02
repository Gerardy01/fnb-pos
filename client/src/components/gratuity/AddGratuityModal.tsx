import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { Option } from "antd/es/mentions";

import { useTranslation } from "react-i18next";
import { useAddGratuity } from "../../hooks/gratuities/useGratuityManagement";

// utils
import { GratuityCalculationTypeEnum } from "../../utils/enums";

// types and interfaces
import { GratuityTableData } from "../../hooks/gratuities/useGratuityManagement";
interface Props {
    open : boolean;
    onClose : () => void;
    onAddGratuitySuccess : (newGratuity : GratuityTableData) => void;
}



export default function AddGratuityModal({ open, onClose, onAddGratuitySuccess } : Props) {

    const { t } = useTranslation(["global", "gratuity"]);

    const {
        loading,
        addGratuityForm,
        calculationType,
        resetData,
        handleAddGratuity,
        handleCalculationTypeChange,
    } = useAddGratuity(onAddGratuitySuccess);

    return (
        <Modal
            title={t("gratuity:addNewGratuity")}
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
                name="addGratuity"
                onFinish={handleAddGratuity}
                autoComplete="off"  
                layout='vertical'
                style={styles.form}
                form={addGratuityForm}
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

                <Form.Item
                    name="writtenName"
                    label={t('gratuity:writtenName')}
                    required
                    rules={[
                        { required: true, message: t("global:fieldRequired") }
                    ]}
                >
                    <Input
                        placeholder={t('gratuity:writtenName')}
                        maxLength={100}
                    />
                </Form.Item>
                
                <div style={styles.twoItemHolder}>
                    <Form.Item
                        name="amount"
                        label={t('gratuity:amount')}
                        required
                        rules={[
                            { required: true, message: t("global:fieldRequired") }
                        ]}
                        style={styles.amountForm}
                    >
                        <InputNumber
                            min={0}
                            max={calculationType == `${GratuityCalculationTypeEnum.PERCENT}` ? 100 : 9999999999999}
                            placeholder={t('gratuity:amount')}
                            addonAfter={(
                                <Select
                                    value={calculationType}
                                    onChange={handleCalculationTypeChange}
                                    style={styles.numberInputSelection}
                                >
                                    <Option value={`${GratuityCalculationTypeEnum.PERCENT}`}>%</Option>
                                    <Option value={`${GratuityCalculationTypeEnum.FIXED}`}>Rp</Option>
                                </Select>
                            )}
                            style={styles.numberInput}
                        />
                    </Form.Item>
                </div>

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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountForm : {
        width: '60%'
    },
    numberInput : {
        width: '100%'
    },
    numberInputSelection : {
        width: '60px'
    }
}