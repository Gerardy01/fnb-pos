import { useEffect, useState } from 'react';

import { SelectProps, TableColumnsType, Space, Button, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import useStaticModal from '../useStaticModal';
import useNotification from '../useNotification';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { accountApi, outletApi, roleApi } from '../../api';

// types and interfaces
import { CreateAccountData, EditAccountManagementBodyData } from '../../models/accountInterface';
import { OutletSelectionData } from '../../models/globalInterface';
export interface AccountTableData {
    key: string;
    name: string;
    username : string;
    email : string;
    roleName : string;
    roleId : number;
}


export default function useAccountManagement() {

    const navigate = useNavigate();

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const { t } = useTranslation(["global", "account", "role"]);
    const { accountId : accountIdFromParams } = useParams();

    const [accounts, setAccounts] = useState<AccountTableData[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<AccountTableData[]>([]);
    const [roleOptions, setRoleOptions] = useState<SelectProps['options']>([]);

    const [addAccountModal, setAddAccountModal] = useState<boolean>(false);
    const [editAccountModal, setEditAccountModal] = useState<boolean>(false);

    const [editAccountData, setEditAccountData] = useState<EditAccountManagementBodyData | null>(null);
    const [newPassword, setNewPassword] = useState<string>("");

    const [getRoleLoad, setGetRoleLoad] = useState<boolean>(true);
    const [getAccountLoad, setGetAccountLoad] = useState<boolean>(true);
    const [getOutletLoad, setGetOutletLoad] = useState<boolean>(true);
    const [getCurrentAccountOutletLoad, setGetCurrentAccountOutletLoad] = useState<boolean>(false);
    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [addAccountSubmitLoad, setAddAccountSubmitLoad] = useState<boolean>(false);
    const [editAccountSubmitLoad, setEditAccountSubmitLoad] = useState<boolean>(false);

    const [assignOutletModal, setAssignOutletModal] = useState<boolean>(false);
    const [outletSelection, setOutletSelection] = useState<OutletSelectionData[]>([]);
    const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectionData[]>([]);
    const [selectOutletErrorMsg, setSelectOutletErrorMsg] = useState<string>("");

    const [roleFilterData, setRoleFilterData] = useState<number[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");

    const [addAccountForm] = Form.useForm();
    const [editAccountForm] = Form.useForm();

    useEffect(() => {
        getRoleData();
        getAccountList();
        getOutletList();
        if (accountIdFromParams) setEditAccountModal(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (getAccountLoad || getRoleLoad || getOutletLoad) return;
        setContentLoad(false);
    }, [getRoleLoad, getAccountLoad, getOutletLoad]);

    useEffect(() => {
        setFilteredAccounts(accounts);
        setSearchWord("");
        setRoleFilterData([]);
    }, [accounts]);

    useEffect(() => {
        if (accountIdFromParams) {
            getSelectedAccountsOutlet();
        }
    }, [accountIdFromParams])

    useEffect(() => {
        if (!editAccountData) return;
        editAccountForm.resetFields();
        editAccountForm.setFieldsValue({
            username: editAccountData.username,
            name: editAccountData.name,
            email: editAccountData.email === "-" ? "" : editAccountData.email,
            role: editAccountData.roleId
        });
        navigate(`/account-management/${editAccountData.accountId}`, { replace: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editAccountData]);

    useEffect(() => {
        if (!searchWord && roleFilterData.length == 0) return setFilteredAccounts(accounts);

        let filteredItems = accounts;

        if (roleFilterData.length > 0) {
            filteredItems = filteredItems.filter(data => roleFilterData.includes(data.roleId));
        }

        if (searchWord) {
            filteredItems = filteredItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.name.toLocaleLowerCase().includes(input) ||
                    data.username.toLocaleLowerCase().includes(input) ||
                    data.email.toLocaleLowerCase().includes(input);
            });
        }

        setFilteredAccounts(filteredItems);

    }, [searchWord, roleFilterData])

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
        
        try {
            const [err, data] = await accountApi.getAllAccount();
            
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

            if (accountIdFromParams) {
                const selectedEditAccount = data.find(item => item.accountId === accountIdFromParams);
                if (!selectedEditAccount) return;
                setEditAccountData({
                    accountId : selectedEditAccount.accountId,
                    username : selectedEditAccount.username,
                    name : selectedEditAccount.name,
                    email : selectedEditAccount.email,
                    roleId : selectedEditAccount.roleId
                });
            }

        } finally {
            setGetAccountLoad(false);
        }
    }

    const getOutletList = async () : Promise<void> => {

        try {
            const [err, data] = await outletApi.getAllOutlet();

            if (err) {
                serverErrorModal();
                return;
            }

            const outletSelectionList : OutletSelectionData[] = [];
            data.forEach(item => {
                outletSelectionList.push({
                    outletId : item.outletId,
                    outletName : item.outletName,
                    status : item.status,
                });
            });

            setOutletSelection(outletSelectionList);

        } finally {
            setGetOutletLoad(false);
        }
    }

    const getSelectedAccountsOutlet = async () : Promise<void> => {

        setGetCurrentAccountOutletLoad(true);

        try {
            const [err, data] = await outletApi.getAllOutlet(`accountId=${accountIdFromParams}`);

            if (err) {
                serverErrorModal();
                return;
            }

            const selectedOutletList : OutletSelectionData[] = [];
            data.forEach(item => {
                selectedOutletList.push({
                    outletId : item.outletId,
                    outletName : item.outletName,
                    status : item.status,
                });
            });

            setSelectedOutlet(selectedOutletList);

        } finally {
            setGetCurrentAccountOutletLoad(false);
        }
    }

    const handleChangeRoleFilter = (value: number[]) : void => {
        setRoleFilterData(value);
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
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
            navigate("/account-management")
        }
    }

    const submitAddAccount = async (value : CreateAccountData) => {
        if (selectedOutlet.length === 0) {
            setSelectOutletErrorMsg(t("account:noOutletErrMsg"));
            return;
        }

        setAddAccountSubmitLoad(true);

        const outletIds : string[] = selectedOutlet.map(item => item.outletId);

        try {
            const [err, data] = await accountApi.createAccount({
                username : value.username,
                name : value.name,
                email : value.email !== undefined ? value.email : null,
                roleId : value.role,
                password : value.password,
                otpCode : Number(value.otpCode),
                outletIds : outletIds,
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
        if (selectedOutlet.length === 0) {
            setSelectOutletErrorMsg(t("account:noOutletErrMsg"));
            return;
        }

        setEditAccountSubmitLoad(true);
        
        try {
            const [err, data] = await accountApi.editAccountManagementApi({
                ...values,
                outletIds: selectedOutlet.map(item => item.outletId),
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
                    errorModal(undefined, t(`account:${err.response.data.message}`));
                    return;
                }
    
                serverErrorModal();
                return;
            }

            setAccounts(prevAccount => 
                prevAccount.map(account =>
                    account.key === data.accountId
                        ? {
                            key : data.accountId,
                            name: data.name,
                            username : data.username,
                            email : data.email,
                            roleName : data.roleName,
                            roleId : data.roleId,
                        }
                        : account
                )
            );
    
            openEditAccount(false);
            successnotification(t("account:accountChangedSuccess"));

        } finally {
            setEditAccountSubmitLoad(false);
        }
    }

    const handleDeleteAccount = async () => {
        if (!editAccountData) return;

        const [err] = await accountApi.deleteAccount(editAccountData.accountId);

        if (err) {
            serverErrorModal();
            return;
        }

        successnotification();
        openEditAccount(false);
        
        const newAccountList = accounts.filter(item => item.key !== editAccountData.accountId);
        setAccounts(newAccountList);
    }

    const handleResetPass = async () => {
        if (!editAccountData) return;

        const [err, data] = await accountApi.resetPassword(editAccountData.accountId);

        if (err) {
            serverErrorModal();
            return;
        }

        setNewPassword(data.newPassword);
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

    const clickResetPassword = () => {
        confirmationModal({
            title : t("account:sureResetPass"),
            content: "",
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : handleResetPass,
        });
    }

    const clearNewPass = () => {
        setNewPassword("");
    }

    const handleAssignSelectedOutlet = (tempSelectedOutlet : OutletSelectionData[]) : void => {
        setSelectedOutlet(tempSelectedOutlet);
        openAssignOutletModal(false);
        setSelectOutletErrorMsg("");
    }

    const resetData = () : void => {
        setSelectOutletErrorMsg("");
        setSelectedOutlet([]);
    }

    const openAssignOutletModal = (open : boolean) : void => {
        setAssignOutletModal(open);
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
        getCurrentAccountOutletLoad,
        newPassword,
        outletSelection,
        selectOutletErrorMsg,
        assignOutletModal,
        selectedOutlet,
        searchWord,
        roleFilterData,
        handleChangeRoleFilter,
        handleSearch,
        openAddAccount,
        openEditAccount,
        submitAddAccount,
        submitEditAccount,
        clickDeleteAccount,
        clickResetPassword,
        clearNewPass,
        resetData,
        openAssignOutletModal,
        handleAssignSelectedOutlet,
    }
}