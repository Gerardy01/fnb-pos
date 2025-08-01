import { Modal, Form, Input, Button, Typography, Alert, Table, Space, Switch, Checkbox, InputNumber } from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { ModifierTableData, useEditModifier } from "../../hooks/modifiers/useModifierManagement";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
    onEditModifierSuccess : (newValue : ModifierTableData) => void;
    onDeleteModifierSuccess : (modifierId : number) => void;
}

const { Text } = Typography;

export default function EditModifierModal({
    open,
    onClose,
    onEditModifierSuccess,
    onDeleteModifierSuccess,
} : Props) {

    const { t } = useTranslation(["global", "modifier"]);

    const {
        modifierData,
        loading,
        submitLoad,
        contentLoad,
        editModifierForm,
        required,
        optionColumns,
        optionData,
        limitChoices,
        modifierOptionErrMsg,
        resetData,
        handleEditModifier,
        clickDeleteBtn,
        handleChangeRequired,
        handleAddOption,
        changeLimitChoices,
    } = useEditModifier(onEditModifierSuccess, onDeleteModifierSuccess);
    
    return (
        <Modal
            title={t("modifier:editModifier")}
            centered
            open={open}
            onCancel={() => {
                onClose();
                resetData();
            }}  
            footer={null}
            maskClosable={false}
            style={styles.modal}
            width={600}
        >
            {contentLoad ? (
                <div style={styles.notContentHolder}>
                    <ContentLoading />
                </div>
            ) : !contentLoad && modifierData ? (
                <Form
                    name="editModifier"
                    onFinish={handleEditModifier}
                    autoComplete="off"  
                    layout='vertical'
                    style={styles.form}
                    form={editModifierForm}
                >
                    <Form.Item
                        name="name"
                        label={t('modifier:name')}
                        required
                        initialValue={modifierData.name}
                        rules={[
                            { required: true, message: t("global:fieldRequired") }
                        ]}
                    >
                        <Input
                            placeholder={t('modifier:name')}
                            maxLength={100}
                        />
                    </Form.Item>

                    <div style={styles.assignationHolder}>
                        <div style={styles.subTitleHolder} >
                            <div style={styles.subTitle}>
                                <Text strong>{t("modifier:modifierOptions")}</Text>
                                <Text style={styles.description} type="secondary">{t("modifier:modifierOptionDesc")}</Text>
                            </div>
                            <Button
                                variant="link"
                                color="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddOption}
                            >
                                {t("modifier:newOption")}
                            </Button>
                        </div>
                        {modifierOptionErrMsg !== "" && (
                            <Alert
                                message={modifierOptionErrMsg}
                                type="error"
                                showIcon
                                style={styles.alert}
                            />
                        )}
                        <Table columns={optionColumns} dataSource={optionData} size="middle" pagination={false} />
                    </div>

                    <Space style={styles.requiredFieldHolder}>
                        <div style={styles.requiredSubTitle}>
                            <Text strong>{t("modifier:required")}</Text>
                            <Text style={styles.description} type="secondary">{t("modifier:requiredDesc")}</Text>
                        </div>
                        <Switch checked={required} onChange={e => handleChangeRequired(e)} />
                    </Space>

                    <Checkbox
                        style={styles.checkBox}
                        checked={limitChoices}
                        onChange={(e) => changeLimitChoices(e.target.checked)}
                    >{t("modifier:checkboxLabel")}</Checkbox>

                    <div style={{...styles.twoItemHolder, display: limitChoices ? 'flex' : 'none'}}>
                        <Form.Item
                            name="min"
                            label={t('modifier:minimumChoices')}
                            required
                            rules={[
                                { required: true, message: t("global:fieldRequired") }
                            ]}
                            style={styles.twoFormItem}
                            initialValue={modifierData.min}
                        >
                            <InputNumber
                                min={required ? 1 : 0}
                                max={optionData.length}
                                placeholder="0"
                                style={styles.numberInput}
                                disabled={!required}
                            />
                        </Form.Item>
                        <Form.Item
                            name="max"
                            label={t('modifier:maximumChoices')}
                            required
                            rules={[
                                { required: true, message: t("global:fieldRequired") }
                            ]}
                            style={styles.twoFormItem}
                            initialValue={modifierData.max}
                        >
                            <InputNumber
                                min={1}
                                max={optionData.length}
                                placeholder="0"
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
        marginBottom: '2rem'
    },
    submitBtnHolder : {
        width: '100%',
        marginBottom: '1rem',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
    notContentHolder : {
        height: '25rem',
    },
    requiredFieldHolder : {
        display : 'flex',
        justifyContent: 'space-between',
        marginBottom : "1.2rem",
    },
    assignationHolder: {
        marginBottom: '2rem',
        marginTop: '2rem',
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
        maxWidth: '80%'
    },
    requiredSubTitle: {
        display: 'flex',
        flexDirection: 'column',
        width: '20rem',
    },
    description : {
        fontSize: '12px'
    },
    checkBox: {
        marginBottom : '1rem'
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
    alert : {
        width: '100%',
        marginBottom: '1rem'
    },
}