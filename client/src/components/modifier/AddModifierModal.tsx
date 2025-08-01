import { Alert, Button, Checkbox, Form, Input, InputNumber, Modal, Space, Switch, Table, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { ModifierTableData, useAddModifier } from "../../hooks/modifiers/useModifierManagement";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
    onAddModifierSuccess : (newModifier : ModifierTableData) => void;
}


const { Text } = Typography;


export default function AddModifierModal({
    open,
    onClose,
    onAddModifierSuccess,
} : Props) {

    const { t } = useTranslation(["global", "category"]);

    const {
        loading,
        addModifierForm,
        required,
        optionColumns,
        optionData,
        limitChoices,
        modifierOptionErrMsg,
        resetData,
        handleAddModifier,
        handleChangeRequired,
        handleAddOption,
        changeLimitChoices,
    } = useAddModifier(onAddModifierSuccess);

    return (
        <Modal
            title={t("modifier:addNewModifier")}
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
            <Form
                name="addModifier"
                onFinish={handleAddModifier}
                autoComplete="off"  
                layout='vertical'
                style={styles.form}
                form={addModifierForm}
            >
                <Form.Item
                    name="name"
                    label={t('modifier:name')}
                    required
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
                        initialValue={required ? 1 : 0}
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
                        initialValue={optionData.length}
                    >
                        <InputNumber
                            min={1}
                            max={optionData.length}
                            placeholder="0"
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