import { Modal } from "antd";

import useAccountManagement from "../../hooks/accounts/useAccountManagement";

// types and interfaces
interface Props {
    open : boolean
    onClose : () => void
}

export default function AddAccountModal({ open, onClose } : Props) {

    const { submitAddAccount } = useAccountManagement();

    return (
        <Modal
            title="Add Account"
            centered
            open={open}
            onOk={() => {
                submitAddAccount();
                onClose();
            }}
            // confirmLoading={confirmLoading}
            onCancel={onClose}
        >
            test
        </Modal>
    )
}