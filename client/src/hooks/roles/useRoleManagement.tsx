import { useEffect, useState } from "react"
import { TableColumnsType, Space, Button, Form } from "antd";

import { EditOutlined } from "@ant-design/icons";

import { permissionApi, roleApi } from "../../api";

import useStaticModal from "../useStaticModal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// types and interfaces
import { PermissionData, PageAccessPermissionData } from "../../models/permissionInterface";
import { RolePermission } from "../../models/roleInterface";
export interface RoleTableData {
    key: number;
    roleName: string;
    description: string
}



export function useRoleManagement() {

    const navigate = useNavigate();

    const { t } = useTranslation(["global", "role"]);

    const { serverErrorModal } = useStaticModal();

    const [roles, setRoles] = useState<RoleTableData[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<RoleTableData[]>([]);

    const [getRoleLoad, setGetRoleLoad] = useState<boolean>(true);
    const [getPermissionLoad, setGetPermissionLoad] = useState<boolean>(true);
    const [getPageAccessPermissionLoad, setGetPageAccessPermissionLoad] = useState<boolean>(true);
    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [permissions, setPermissions] = useState<PermissionData[]>([]);
    const [pageAccessPermissions, setPageAccessPermissions] = useState<PageAccessPermissionData[]>([]);

    const [addRoleModal, setAddRoleModal] = useState<boolean>(false);

    useEffect(() => {
        getRoleData();
        getPermissionData();
        getPageAccessPermissionData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (getRoleLoad || getPermissionLoad || getPageAccessPermissionLoad) return;
        setContentLoad(false);
    }, [getRoleLoad, getPermissionLoad, getPageAccessPermissionLoad])

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
            setGetRoleLoad(false);
        }
    }

    const getPermissionData = async () : Promise<void> => {
        try {
            const [err, data] = await permissionApi.getAllPermission();
    
            if (err) {
                if (err.status === 500) {
                    serverErrorModal();
                }
                return;
            }

            setPermissions(data);

        } finally {
            setGetPermissionLoad(false);
        }
    }

    const getPageAccessPermissionData = async () : Promise<void> => {
        try {
            const [err, data] = await permissionApi.getAllPageAccessPermission();
    
            if (err) {
                if (err.status === 500) {
                    serverErrorModal();
                }
                return;
            }

            setPageAccessPermissions(data);
            
        } finally {
            setGetPageAccessPermissionLoad(false);
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
        navigate(`/role-management/${roleId}`, { replace: false });  
    }

    const openAddRole = (open : boolean) => {
        setAddRoleModal(open);
    }

    return {
        addRoleModal,
        contentLoad,
        columns,
        roles : filteredRoles,
        permissions,
        pageAccessPermissions,
        handleSearch,
        openAddRole,
    }
}


export function useAddRole() {

    const [addRoleForm] = Form.useForm();

    const [selectedPageAccessPermission, setSelectedPageAccessPermission] = useState<number[]>([]);
    const [selectedPermission, setSelectedPermission] = useState<RolePermission[]>([]);

    const handleTogglePageAccessPermission = (value : number, isChecked : boolean) : void => {
        if (isChecked) {
            setSelectedPageAccessPermission(prev => [...prev, value]);
        }

        if (!isChecked) {
            const filtered = selectedPageAccessPermission.filter(item => item !== value);
            setSelectedPageAccessPermission(filtered);
        }
    }

    const handleTogglePermission = (permissionId : number, isChecked : boolean, type : string) : void => {
        setSelectedPermission(prev => {
            // Find the existing permission if it exists
            const existingPermissionIndex = prev.findIndex(p => p.permissionId === permissionId);
            const existingPermission = existingPermissionIndex >= 0 
                ? prev[existingPermissionIndex] 
                : { permissionId, read: false, write: false };
            
            let updatedPermission: RolePermission;
            
            if (type === 'write') {
                updatedPermission = {
                    ...existingPermission,
                    write: isChecked,
                    read: isChecked ? true : existingPermission.read
                };
            } else if (type === 'read') {
                updatedPermission = {
                    ...existingPermission,
                    read: isChecked,
                    write: isChecked ? existingPermission.write : false
                };
            } else {
                updatedPermission = existingPermission;
            }
            
            // If both read and write are false, remove the permission entirely
            if (!updatedPermission.read && !updatedPermission.write) {
                return prev.filter(p => p.permissionId !== permissionId);
            }
            
            // Otherwise, update or add the permission
            const newPermissions = [...prev];
            if (existingPermissionIndex >= 0) {
                newPermissions[existingPermissionIndex] = updatedPermission;
            } else {
                newPermissions.push(updatedPermission);
            }
            
            return newPermissions;
        });
    }

    const resetData = () => {
        addRoleForm.resetFields();
        setSelectedPageAccessPermission([]);
        setSelectedPermission([]);
    }

    return {
        addRoleForm,
        selectedPermission,
        selectedPageAccessPermission,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        resetData,
    }
}