import { useEffect, useState } from "react"
import { TableColumnsType, Space, Button } from "antd";

import { EditOutlined } from "@ant-design/icons";

import { roleApi } from "../../api";

import useStaticModal from "../useStaticModal";
import { useTranslation } from "react-i18next";

// types and interfaces
export interface RoleTableData {
    key: number;
    roleName: string;
    description: string
}



export default function useRoleManagement() {

    const { t } = useTranslation(["global", "role"]);

    const { serverErrorModal } = useStaticModal();

    const [roles, setRoles] = useState<RoleTableData[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<RoleTableData[]>([]);
    const [contentLoad, setContentLoad] = useState<boolean>(true);

    useEffect(() => {
        getRoleData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredRoles(roles);
    }, [roles]);

    const columns: TableColumnsType<RoleTableData> = [
        {
            title: t("role:roleName"),
            dataIndex: 'roleName',
            sorter: (a, b) => a.roleName.localeCompare(b.roleName),
        },
        {
            title: t("global:description"),
            dataIndex: 'description',
        },
        {
            title: t("global:action"),
            key: 'action',
            align: 'center',
            render(_, record) {
                return (
                    <Space size="middle">
                        <Button
                            icon={<EditOutlined />}
                            color="default"
                            variant='outlined'
                            onClick={() => handleEdit(record.key)}
                        >
                            {t("global:edit")}
                        </Button>
                    </Space>
                )
            },
        }
    ]

    const getRoleData = async () : Promise<void> => {

        try {
            const [err, data] = await roleApi.getRoleList();
    
            if (err) {
                if (err.status === 500) {
                    serverErrorModal();
                }
                return;
            }
    
            const roleListData : RoleTableData[] = [];
            data.forEach(item => {
                roleListData.push({
                    key: item.roleId,
                    roleName : item.roleName,
                    description : item.description ? item.description : "-"
                });
            });
    
            setRoles(roleListData);
            setFilteredRoles(roleListData);
        } finally {
            setContentLoad(false);
        }
    }

    const handleSearch = (value : string) : void => {
        const filtered = roles.filter(item => {
            const input = value.toLocaleLowerCase();
            return item.roleName.toLocaleLowerCase().includes(input);
        });
        setFilteredRoles(filtered);
    }

    const handleEdit = (roleId : number) => {
        console.log(roleId)
    }

    return {
        contentLoad,
        columns,
        roles : filteredRoles,
        handleSearch,
    }
}