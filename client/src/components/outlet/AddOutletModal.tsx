import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";

import { useTranslation } from "react-i18next";

// types and interfaces
interface Props {
    open : boolean;
    onClose : () => void;
}


export default function AddOutletModal({ open, onClose } : Props) {

    const { t } = useTranslation(["global", "outlet"]);

    return (
        <Modal
            title={t("outlet:addNewOutlet")}
            centered
            open={open}
            onCancel={() => {
                onClose();
            }}  
            footer={null}
            maskClosable={false}
            style={styles.modal}
        >
            <Form
                name="addOutlet"
                // onFinish={onSubmit}
                autoComplete="off"  
                layout='vertical'
                style={styles.form}
                // form={form}
            >
                <Form.Item
                    name="outletName"
                    label={t('outlet:outletName')}
                    required
                    rules={[
                        { required: true, message: t("global:fieldRequired") }
                    ]}
                >
                    <Input
                        placeholder={t('outlet:outletName')}
                        maxLength={100}
                    />
                </Form.Item>
                <Form.Item
                    name="address"
                    label={t('outlet:addressOptional')}
                >
                    <TextArea
                        placeholder={t('outlet:yourAddress')}
                        maxLength={200}
                        rows={3}
                    />
                </Form.Item>

                <div style={styles.twoItemHolder}>
                    <Form.Item
                        name="city"
                        label={t('outlet:cityOptional')}
                        style={styles.twoFormItem}
                    >
                        <Input
                            placeholder={t('outlet:city')}
                            maxLength={50}
                        />
                    </Form.Item>
                    <Form.Item
                        name="province"
                        label={t('outlet:provinceOptional')}
                        style={styles.twoFormItem}
                    >
                        <Input
                            placeholder={t('outlet:province')}
                            maxLength={50}
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    name="postalCode"
                    label={t('outlet:postalCodeOptional')}
                    style={styles.twoFormItem}
                >
                    <Input
                        placeholder="00000"
                        maxLength={10}
                    />
                </Form.Item>
                <Form.Item style={styles.submitBtnHolder}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        // loading={submitLoad}
                        // disabled={emailCheckLoad || usernameCheckLoad}
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
    }
}