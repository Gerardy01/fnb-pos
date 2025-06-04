
import { Typography, Input, Button, Select, Table, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import useAccountManagement from '../hooks/accounts/useAccountManagement';
import { useTranslation } from 'react-i18next';

// components
import AddAccountModal from '../components/account/AddAccountModal';
import EditAccountModal from '../components/account/EditAccountModal';

// types and interfaces
import { AccountTableData } from '../hooks/accounts/useAccountManagement';

const { Title } = Typography;
const { Search } = Input;


export default function AccountManagement() {

    const { t } = useTranslation("account");

    const {
        roleOptions,
        contentLoad,
        columns,
        accounts,
        addAccountModal,
        editAccountModal,
        addAccountForm,
        editAccountForm,
        editAccountData,
        addAccountSubmitLoad,
        editAccountSubmitLoad,
        newPassword,
        handleChangeRoleFilter,
        handleSearch,
        openAddAccount,
        openEditAccount,
        submitAddAccount,
        submitEditAccount,
        clickDeleteAccount,
        clickResetPassword,
        clearNewPass,
    } = useAccountManagement();

    return (
        <div>
            <Title level={3}>{t("accountManagement")}</Title>
            {contentLoad ? (
                <div style={styles.controlSection}>
                    <div style={styles.skeletonInput}>
                        <Skeleton.Input active size="large" block />
                    </div>

                    <div style={styles.rightSide}>
                        <Skeleton.Input active size="large" style={styles.selectionInput}/>
                        <Skeleton.Button active size="large" style={styles.skeletonbtn}/>
                    </div>
                </div>    
            ) : (
                <div style={styles.controlSection}>
                    <Search
                        style={styles.searchInput}
                        size='large'
                        allowClear
                        placeholder={t("accountSearchPlaceholder")}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Select
                            style={styles.selectionInput}
                            size='large'
                            placeholder={t("selectRoleFilter")}
                            mode="multiple"
                            allowClear
                            options={roleOptions}
                            onChange={handleChangeRoleFilter}
                            filterOption={(input, option) =>
                                (option?.label as string).toLowerCase().includes(input.toLowerCase())
                            }
                        />
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={() => openAddAccount(true)}
                        >
                            {t("newAccount")}
                        </Button>
                    </div>
                </div>
            )}
            <Table<AccountTableData> columns={columns} dataSource={accounts} size='middle' loading={contentLoad} />
            <AddAccountModal
                form={addAccountForm}
                roleOptions={roleOptions}
                open={addAccountModal}
                submitLoad={addAccountSubmitLoad}
                onClose={() => openAddAccount(false)}
                onSubmit={submitAddAccount}
            />
            
            <EditAccountModal
                form={editAccountForm}
                roleOptions={roleOptions}
                open={editAccountModal}
                selectedAccountData={editAccountData}
                submitLoad={editAccountSubmitLoad}
                newPassword={newPassword}
                onClose={() => openEditAccount(false)}
                onSubmit={submitEditAccount}
                onDeleteAccount={clickDeleteAccount}
                onResetPass={clickResetPassword}
                clearNewPass={clearNewPass}
            />
        </div>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    controlSection : {
        width: '100%',
        marginTop: '3rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchInput : {
        maxWidth: '40%',
    },
    rightSide : {
        display: 'flex',
        alignItems: 'center'
    },
    selectionInput : {
        width: '350px',
        margin: '0px 1rem'
    },
    skeletonbtn : {
        width: '140px'
    },
    skeletonInput : {
        minWidth: '40%'
    }
}