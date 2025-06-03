import { useEffect, useState } from 'react';

import { SelectProps, TableColumnsType, Space, Button, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import useStaticModal from '../useStaticModal';
import useNotification from '../useNotification';
import { useTranslation } from 'react-i18next';

import { accountApi, roleApi } from '../../api';

// types and interfaces
import { CreateAccountData, EditAccountManagementBodyData } from '../../models/accountInterface';
export interface AccountTableData {
    key: string;
    name: string;
    username : string;
    email : string;
    roleName : string;
    roleId : number;
}


export default function useAccountManagement() {

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const { t } = useTranslation(["global", "account", "role"]);

    const [accounts, setAccounts] = useState<AccountTableData[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<AccountTableData[]>([]);
    const [roleOptions, setRoleOptions] = useState<SelectProps['options']>([]);

    const [addAccountModal, setAddAccountModal] = useState<boolean>(false);
    const [editAccountModal, setEditAccountModal] = useState<boolean>(false);

    const [editAccountData, setEditAccountData] = useState<EditAccountManagementBodyData | null>(null);

    const [getRoleLoad, setGetRoleLoad] = useState<boolean>(true);
    const [getAccountLoad, setGetAccountLoad] = useState<boolean>(true);
    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [addAccountSubmitLoad, setAddAccountSubmitLoad] = useState<boolean>(false);
    const [editAccountSubmitLoad, setEditAccountSubmitLoad] = useState<boolean>(false);

    const [addAccountForm] = Form.useForm();
    const [editAccountForm] = Form.useForm();

    useEffect(() => {
        getRoleData();
        getAccountList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (getAccountLoad || getRoleLoad) return;
        setContentLoad(false);
    }, [getRoleLoad, getAccountLoad]);

    useEffect(() => {
        setFilteredAccounts(accounts);
    }, [accounts]);

    const columns: TableColumnsType<AccountTableData> = [
        {
            title: t("account:name"),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: t("account:username"),
            dataIndex: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: t("account:email"),
            dataIndex: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: t("account:role"),
            dataIndex: 'roleName',
            sorter: (a, b) => a.roleName.localeCompare(b.roleName),
        },
        {
            title: t("global:action"),
            key: 'action',
            align: 'center',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button
                            icon={<EditOutlined />}
                            color="default"
                            variant='outlined'
                            onClick={() => handleSelectEdit({
                                accountId : record.key,
                                username : record.username,
                                name : record.name,
                                email : record.email,
                                roleId : record.roleId
                            })}
                        >
                            {t("global:edit")}
                        </Button>
                    </Space>
                )
            }
        }
    ]

    const handleSelectEdit = (data : EditAccountManagementBodyData) => {
        openEditAccount(true);
        setEditAccountData(data);
    }

    const getRoleData = async () : Promise<void> => {
        const [err, data] = await roleApi.getRoleList();

        try {
            if (err) {
                if (err.status === 500) {
                    errorModal(undefined, t("role:getRoleDataWrong"));
                }
                return;
            }

            const roleList : SelectProps['options'] = [];
            data.forEach(item => {
                roleList.push({
                    label: item.roleName,
                    value: item.roleId
                });
            });

            setRoleOptions(roleList);

        } finally {
            setGetRoleLoad(false);
        }
    }

    const getAccountList = async () : Promise<void> => {
        const [err, data] = await accountApi.getAllAccount();

        try {
            if (err) {
                if (err.status === 500) {
                    serverErrorModal();
                }
                return;
            }

            const accountTableDataList : AccountTableData[] = [];
            data.forEach(item => {
                accountTableDataList.push({
                    key: item.accountId,
                    name: item.name,
                    username: item.username,
                    email: item.email ? item.email : "-",
                    roleName: item.roleName,
                    roleId: item.roleId,
                });
            });
            
            setAccounts(accountTableDataList);
            setFilteredAccounts(accountTableDataList);

        } finally {
            setGetAccountLoad(false);
        }
    }

    const handleChangeRoleFilter = (value: number[]) : void => {
        if (value.length === 0) return setFilteredAccounts(accounts);

        const filtered = accounts.filter(data => value.includes(data.roleId));
        setFilteredAccounts(filtered);
    }

    const handleSearch = (value : string) : void => {
        const filtered = accounts.filter(data => {
            const input = value.toLocaleLowerCase();
            return data.name.toLocaleLowerCase().includes(input) ||
                data.username.toLocaleLowerCase().includes(input) ||
                data.email.toLocaleLowerCase().includes(input);
        });
        setFilteredAccounts(filtered);
    }

    const openAddAccount = (open : boolean) => {
        setAddAccountModal(open);
        addAccountForm.resetFields();
    }

    const openEditAccount = (open : boolean) => {
        setEditAccountModal(open);
        editAccountForm.resetFields();

        if (!open) {
            setEditAccountData(null);
        }
    }

    const submitAddAccount = async (value : CreateAccountData) => {
        setAddAccountSubmitLoad(true);

        try {
            const [err, data] = await accountApi.createAccount({
                username : value.username,
                name : value.name,
                email : value.email !== undefined ? value.email : null,
                roleId : value.role,
                password : value.password,
                otpCode : Number(value.otpCode)
            });
    
            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 403) {
                    errorModal(t('global:failed'), t(`account:${err.response.data.message}`));
                    return;
                }
    
                if (err.status == 409) {
                    errorModal(t('global:conflict'), t(`account:${err.response.data.message}`));
                    return;
                }
    
                if (err.status === 422) {
                    errorModal(
                        t(`account:wrongPassFormat`),
                        t(`account:${err.response.data.userMessage}`)
                    );
                    return;
                }
    
                serverErrorModal();
                return;
            }
    
            setAccounts([...accounts, {
                key : data.accountId,
                name: data.name,
                username : data.username,
                email : data.email,
                roleName : data.roleName,
                roleId : data.roleId
            }]);
            openAddAccount(false);
            successnotification(t("account:accountAddSuccess"));

        } finally {
            setAddAccountSubmitLoad(false)
        }
    }

    const submitEditAccount = async (values : EditAccountManagementBodyData) => {
        setEditAccountSubmitLoad(true);

        try {
            const [err, data] = await accountApi.editAccountManagementApi(values);
    
            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 403) {
                    errorModal(t('global:failed'), t(`account:${err.response.data.message}`));
                    return;
                }
    
                if (err.status == 409) {
                    errorModal(t('global:conflict'), t(`account:${err.response.data.message}`));
                    return;
                }
    
                if (err.status === 422) {
                    errorModal(undefined, t(`account:${err.response.data.message}`));
                    return;
                }
    
                serverErrorModal();
                return;
            }
    
            const accountsFiltered = accounts.filter(item => item.key !== data.accountId);
    
            setAccounts([...accountsFiltered, {
                key : data.accountId,
                name: data.name,
                username : data.username,
                email : data.email,
                roleName : data.roleName,
                roleId : data.roleId
            }]);
    
            openEditAccount(false);
            successnotification(t("account:accountChangedSuccess"));

        } finally {
            setEditAccountSubmitLoad(false);
        }
    }

    const handleDeleteAccount = async () => {
        
    }

    const clickDeleteAccount = () => {
        confirmationModal({
            title : t("account:sureDeleteAccount"),
            content: t("account:deleteAccountDesc"),
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : handleDeleteAccount,
        });
    }

    return {
        roleOptions,
        contentLoad,
        columns,
        accounts : filteredAccounts,
        addAccountModal,
        editAccountModal,
        addAccountForm,
        editAccountForm,
        editAccountData,
        addAccountSubmitLoad,
        editAccountSubmitLoad,
        handleChangeRoleFilter,
        handleSearch,
        openAddAccount,
        openEditAccount,
        submitAddAccount,
        submitEditAccount,
        clickDeleteAccount,
    }
}