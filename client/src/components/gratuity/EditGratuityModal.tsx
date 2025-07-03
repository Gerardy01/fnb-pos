import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

import { useTranslation } from "react-i18next";
import { GratuityTableData, useEditGratuity } from "../../hooks/gratuities/useGratuityManagement";

// utils
import { GratuityCalculationTypeEnum } from "../../utils/enums";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
    onEditGratuitySuccess : (newValue : GratuityTableData) => void;
    onDeleteGratuitySuccess : (gratuityId : number) => void; 
}

export default function EditGratuityModal({
    open,
    onClose,
    onEditGratuitySuccess,
    onDeleteGratuitySuccess,
} : Props) {

    const { t } = useTranslation(["global", "gratuity"]);

    const {
        contentLoad,
        gratuityData,
        editGratuityForm,
        calculationType,
        submitLoad,
        loading,
        handleCalculationTypeChange,
        handleEditGratuity,
        clickDeleteBtn,
    } = useEditGratuity(onEditGratuitySuccess, onDeleteGratuitySuccess);

    return (
        <Modal
            title={t("gratuity:editGratuity")}
            centered
            open={open}
            onCancel={() => {
                onClose();
            }}
            footer={null}
            maskClosable={false}
            width={400}
        >
            {contentLoad ? (
                <div style={styles.notContentHolder}>
                    <ContentLoading />
                </div>
            ) : !contentLoad && gratuityData ? (
                <Form
                    name="editGratuity"
                    onFinish={handleEditGratuity}
                    autoComplete="off"  
                    layout='vertical'
                    style={styles.form}
                    form={editGratuityForm}
                >
                    <Form.Item
                        name="name"
                        label={t('gratuity:name')}
                        required
                        initialValue={gratuityData.name}
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
                        initialValue={gratuityData.writtenName}
                        rules={[
                            { required: true, message: t("global:fieldRequired") }
                        ]}
                        tooltip={t("gratuity:writtenNameInfo")}
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
                            initialValue={gratuityData.amount}
                            rules={[
                                { required: true, message: t("global:fieldRequired") }
                            ]}
                            style={styles.amountForm}
                        >
                            <InputNumber
                                min={0}
                                max={calculationType == `${GratuityCalculationTypeEnum.PERCENT}` ? 100 : 9999999999999}
                                placeholder={t('gratuity:amount')}
                                prefix={calculationType == `${GratuityCalculationTypeEnum.PERCENT}` ? "%" : "Rp"}
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
        marginBottom: '10rem'
    },
    submitBtnHolder : {
        width: '100%',
        marginBottom: '1rem',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
    twoItemHolder: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    twoFormItem: {
        width: '48%'
    },
    notContentHolder : {
        height: '21rem',
    },
    deactivateBtn : {
        marginLeft: '10px'
    },
    amountForm : {
        width: '100%'
    },
    numberInput : {
        width: '100%'
    },
    numberInputSelection : {
        width: '60px'
    }
}