import { useEffect, useState } from 'react';

import { SelectProps, TableColumnsType, Space, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import useStaticModal from '../useStaticModal';
import { useTranslation } from 'react-i18next';

import { accountApi, roleApi } from '../../api';

// types and interfaces
export interface AccountTableData {
    key: string;
    name: string;
    username : string;
    email : string;
    roleName : string;
    roleId : number;
}


export default function useAccountManagement() {

    const { serverErrorModal, errorModal } = useStaticModal();

    const { t } = useTranslation(["global", "account", "role"]);

    const [accounts, setAccounts] = useState<AccountTableData[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<AccountTableData[]>([]);
    const [roleOptions, setRoleOptions] = useState<SelectProps['options']>([]);

    const [getRoleLoad, setGetRoleLoad] = useState<boolean>(true);
    const [getAccountLoad, setGetAccountLoad] = useState<boolean>(true);
    const [contentLoad, setContentLoad] = useState<boolean>(true);

    useEffect(() => {
        getRoleData();
        getAccountList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (getAccountLoad || getRoleLoad) return;
        setContentLoad(false);
    }, [getRoleLoad, getAccountLoad]);

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
            render: () => {
                return (
                    <Space size="middle">
                        <Button icon={<EditOutlined />} color="default" variant='outlined'>
                            {t("global:edit")}
                        </Button>
                    </Space>
                )
            }
        }
    ]

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

    return {
        roleOptions,
        contentLoad,
        columns,
        accounts : filteredAccounts,
        handleChangeRoleFilter,
        handleSearch
    }
}