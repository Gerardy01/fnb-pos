import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { DeleteFilled } from "@ant-design/icons";

import { useEditOutlet } from "../../hooks/outlets/useOutletManagement";
import { useTranslation } from "react-i18next";

// components
import ContentLoading from "../loading/ContentLoading";
import ContentNotFound from "../global/ContentNotFound";

// types and interfaces
import { OutletTableData } from "../../hooks/outlets/useOutletManagement";
interface Props {
    open : boolean;
    onClose : () => void;
    onEditOutletSuccess : (newValue : OutletTableData) => void;
    onDeleteOutletSuccess : (outletId : string) => void;
    onChangeStatusSuccess : (outletId : string, newStatus : boolean) => void;
}


export default function EditOutletModal({ open, onClose, onEditOutletSuccess, onDeleteOutletSuccess, onChangeStatusSuccess } : Props) {

    const { t } = useTranslation(["global", "outlet"]);

    const {
        contentLoad,
        outletData,
        editOutletForm,
        submitLoad,
        loading,
        handleEditOutlet,
        clickDeleteBtn,
        handleChangeStatus,
    } = useEditOutlet(onEditOutletSuccess, onDeleteOutletSuccess, onChangeStatusSuccess);

    return (
        <Modal
            title={t("outlet:editOutlet")}
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
            ) : !contentLoad && outletData ? (
                <>
                    <Form
                        name="addOutlet"
                        onFinish={handleEditOutlet}
                        autoComplete="off"  
                        layout='vertical'
                        style={styles.form}
                        form={editOutletForm}
                    >
                        <Form.Item
                            name="outletName"
                            label={t('outlet:outletName')}
                            required
                            rules={[
                                { required: true, message: t("global:fieldRequired") }
                            ]}
                            initialValue={outletData.outletName}
                        >
                            <Input
                                placeholder={t('outlet:outletName')}
                                maxLength={100}
                            />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label={t('outlet:addressOptional')}
                            initialValue={outletData.address}
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
                                initialValue={outletData.city}
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
                                initialValue={outletData.province}
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
                            initialValue={outletData.postalCode}
                            style={styles.twoFormItem}
                        >
                            <Input
                                placeholder="00000"
                                maxLength={10}
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
                                    danger={outletData.status}
                                    style={{
                                        ...styles.deactivateBtn,
                                        backgroundColor: outletData.status ? undefined : '#52c41a',
                                        borderColor: outletData.status ? undefined : '#52c41a',
                                    }}
                                    onClick={() => handleChangeStatus(!outletData.status)}
                                    disabled={submitLoad}
                                    loading={loading}
                                >
                                    {outletData.status ? t("global:deactivate") : t("global:activate")}
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
    twoItemHolder: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    twoFormItem: {
        width: '48%'
    },
    notContentHolder : {
        height: '30rem',
    },
    deactivateBtn : {
        marginLeft: '10px'
    }
}