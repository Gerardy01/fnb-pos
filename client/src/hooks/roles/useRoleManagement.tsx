import { useEffect, useState } from "react"
import { TableColumnsType, Space, Button, Form, FormProps } from "antd";

import { EditOutlined } from "@ant-design/icons";

import { permissionApi, roleApi } from "../../api";

import { PageAccessPermissionEnum, PermissionEnum } from "../../utils/enums";

import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// types and interfaces
import { PermissionData, PageAccessPermissionData } from "../../models/permissionInterface";
import { OneRoleData, RolePermission } from "../../models/roleInterface";
interface PermissionRule {
    pageAccessId: number;
    requiredPermissions: {
        permissionId: number;
        read: boolean;
        write?: boolean;
    }[];
}
interface RoleForm {
    roleName : string;
    description? : string;
}
export interface RoleTableData {
    key: number;
    roleName: string;
    description: string
}



export function useRoleManagement() {

    const navigate = useNavigate();

    const { t } = useTranslation(["global", "role"]);
    const { roleId : roleIdFormParams } = useParams();

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
    const [editRoleModal, setEditRoleModal] = useState<boolean>(false);

    useEffect(() => {
        getRoleData();
        getPermissionData();
        getPageAccessPermissionData();
        if (roleIdFormParams) setEditRoleModal(true);
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
        setEditRoleModal(true);
    }

    const openAddRole = (open : boolean) => {
        setAddRoleModal(open);
    }

    const openEditRole = (open : boolean) => {
        setEditRoleModal(open);

        if (!open) {
            navigate(`/role-management`);
        }
    }

    const onAddRoleSuccess = (newRole : RoleTableData) : void => {
        setRoles(prev => [...prev, newRole]);
        setAddRoleModal(false);
    }

    const onEditRoleSuccess = (roleId : number, roleData : RoleTableData) : void => {
        const filtered = roles.filter(item => item.key !== roleId);
        setRoles([...filtered, roleData]);
        setEditRoleModal(false);
    }

    const onDeleteRoleSuccess = (roleId : number) : void => {
        const filtered = roles.filter(item => item.key !== roleId);
        setRoles(filtered);
    }

    return {
        addRoleModal,
        editRoleModal,
        contentLoad,
        columns,
        roles : filteredRoles,
        permissions,
        pageAccessPermissions,
        roleIdFormParams,
        handleSearch,
        openAddRole,
        openEditRole,
        onAddRoleSuccess,
        onEditRoleSuccess,
        onDeleteRoleSuccess,
    }
}


export function useAddRole(pushNewRole : (newRole : RoleTableData) => void) {

    const { t } = useTranslation(["global", "role"]);

    const { errorModal, serverErrorModal } = useStaticModal();
    const { successnotification } = useNotification();
    const {
        selectedPermission,
        selectedPageAccessPermission,
        isAdvanced,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        resetSelectedPermissions,
        handleSetAdvanced,
    } = usePermissionSetHandling();

    const [addRoleForm] = Form.useForm();
    const [pageAccessPermissionErrorMsg, setPageAccessPermissionErrorMsg] = useState<string>("");
    const [permissionErrorMsg, setPermissionErrorMsg] = useState<string>("");
    const [addRoleLoad, setAddRoleLoad] = useState<boolean>(false);

    const resetData = () : void => {
        addRoleForm.resetFields();
        resetSelectedPermissions();
        setPermissionErrorMsg("");
        setPageAccessPermissionErrorMsg("");
    }

    const submitAddRole : FormProps<RoleForm>['onFinish'] = async (values) => {

        if (selectedPageAccessPermission.length === 0) {
            setPageAccessPermissionErrorMsg(t("role:selectOne"));
            return;
        }

        if (selectedPermission.length === 0 && isAdvanced) {
            setPermissionErrorMsg(t("role:selectOne"));
            return;
        }

        setAddRoleLoad(true);
        
        try {
            const [err, data] = await roleApi.createRole({
                roleName : values.roleName,
                description : values?.description,
                permissions : selectedPermission,
                pageAccessPermissionIds : selectedPageAccessPermission
            });
    
            if (err) {
                if (err.status === 409) {
                    errorModal(t('global:failed'), err.response.data.message);
                    return;
                }
    
                serverErrorModal();
                return;
            }
    
            successnotification(t("role:roleAddSuccess"));
            pushNewRole({
                key: data.roleId,
                roleName : data.roleName,
                description : data.description
            });
            resetSelectedPermissions();

        } finally {
            setAddRoleLoad(false);
        }
    }

    return {
        addRoleForm,
        selectedPermission,
        selectedPageAccessPermission,
        isAdvanced,
        permissionErrorMsg,
        pageAccessPermissionErrorMsg,
        addRoleLoad,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        resetData,
        handleSetAdvanced,
        submitAddRole,
    }
}


export function useEditRole(pushNewEditedRole : (roleId : number, roleData : RoleTableData) => void) {

    const { t } = useTranslation(["global", "role"]);
    const { roleId : roleIdFormParams } = useParams();

    const { errorModal, serverErrorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const navigate = useNavigate();

    const {
        selectedPermission,
        selectedPageAccessPermission,
        isAdvanced,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        resetSelectedPermissions,
        handleSetAdvanced,
        handleSetPermisions,
        handleSetPageAccessPermissions,
    } = usePermissionSetHandling();

    const [editRoleForm] = Form.useForm();
    const [pageAccessPermissionErrorMsg, setPageAccessPermissionErrorMsg] = useState<string>("");
    const [permissionErrorMsg, setPermissionErrorMsg] = useState<string>("");
    const [selectedRoleData, setSelectedRoleData] = useState<OneRoleData | null>(null);
    const [getOneRoleLoad, setGetOneRoleLoad] = useState(true);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);

    useEffect(() => {
        getOneRoleData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getOneRoleData = async () => {
        
        try {
            const [err, data] = await roleApi.getOneRole(Number(roleIdFormParams));

            if (err) {

                if (err.status === 404) {
                    return;
                }

                serverErrorModal();
                return;
            }

            setSelectedRoleData({
                roleId : data.roleId,
                roleName : data.roleName,
                description : data.description,
                permissions : data.permissions,
                pageAccessPermissionIds : data.pageAccessPermissionIds
            });

            handleSetPermisions(data.permissions);
            handleSetPageAccessPermissions(data.pageAccessPermissionIds);

        } finally {
            setGetOneRoleLoad(false);
        }
    }

    const submitEditRole : FormProps<RoleForm>['onFinish'] = async (values) => {

        if (selectedPageAccessPermission.length === 0) {
            setPageAccessPermissionErrorMsg(t("role:selectOne"));
            return;
        }

        if (selectedPermission.length === 0 && isAdvanced) {
            setPermissionErrorMsg(t("role:selectOne"));
            return;
        }

        setSubmitLoad(true);

        try {

            const [err, data] = await roleApi.editRole({
                roleId : Number(roleIdFormParams),
                roleName : values.roleName,
                description : values.description,
                permissions : selectedPermission,
                pageAccessPermissionIds : selectedPageAccessPermission
            });

            if (err) {

                if (err.status === 409) {
                    errorModal(t('global:failed'), err.response.data.message);
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("role:roleEditSuccess"));
            pushNewEditedRole(data.roleId, {
                key : data.roleId,
                roleName : data.roleName,
                description : data.description,
            });
            resetSelectedPermissions();
            navigate("/role-management")
        } finally {
            setSubmitLoad(false);
        }

    }

    const resetData = () : void => {
        editRoleForm.resetFields();
        resetSelectedPermissions();
        setPermissionErrorMsg("");
        setPageAccessPermissionErrorMsg("");
    }

    return {
        editRoleForm,
        selectedPermission,
        selectedPageAccessPermission,
        isAdvanced,
        pageAccessPermissionErrorMsg,
        permissionErrorMsg,
        getOneRoleLoad,
        selectedRoleData,
        submitLoad,
        resetData,
        submitEditRole,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        handleSetAdvanced,
    }
}



function usePermissionSetHandling() {

    const [isAdvanced, setIsAdvanced] = useState<boolean>(false);

    const [selectedPageAccessPermission, setSelectedPageAccessPermission] = useState<number[]>([]);
    const [selectedPermission, setSelectedPermission] = useState<RolePermission[]>([]);

    const permissionRules: PermissionRule[] = [
        {
            pageAccessId: PageAccessPermissionEnum.ACCOUNT_MANAGEMENT,
            requiredPermissions: [
                { permissionId: PermissionEnum.ACCOUNT_MANAGEMENT, read: true, write: true },
                { permissionId: PermissionEnum.ROLE_MANAGEMENT, read: true }
            ]
        },
        {
            pageAccessId: PageAccessPermissionEnum.ROLE_MANAGEMENT,
            requiredPermissions: [
                { permissionId: PermissionEnum.ROLE_MANAGEMENT, read: true, write: true },
            ]
        },
        {
            pageAccessId: PageAccessPermissionEnum.ORGANIZATION_SETTINGS,
            requiredPermissions: [
                { permissionId: PermissionEnum.ORGANIZATION_MANAGEMENT, read: true, write: true },
            ]
        }
    ];

    const checkPageAccessRequirements = (pageAccessId: number, currentPermissions: RolePermission[]): boolean => {
        const rule = permissionRules.find(r => r.pageAccessId === pageAccessId);
        if (!rule) return true;
        
        return rule.requiredPermissions.every(req => {
            const perm = currentPermissions.find(p => p.permissionId === req.permissionId);
            if (!perm) return false;
            return perm.read && (req.write ? perm.write : true);
        });
    };
    
    const isPermissionStillRequired = (permissionId: number, enabledPageAccesses: number[]) => {
        return permissionRules.some(rule => 
            enabledPageAccesses.includes(rule.pageAccessId) &&
            rule.requiredPermissions.some(req => req.permissionId === permissionId)
        );
    };

    const handleTogglePageAccessPermission = (value : number, isChecked : boolean) : void => {
        if (isChecked) {
            setSelectedPermission(prev => {
                const rule = permissionRules.find(r => r.pageAccessId === value);
                if (!rule) return prev;
                
                const newPermissions = [...prev];
                
                rule.requiredPermissions.forEach(req => {
                    const existingIndex = newPermissions.findIndex(p => p.permissionId === req.permissionId);
                    const newPerm: RolePermission = {
                        permissionId: req.permissionId,
                        read: true,
                        write: req.write || false
                    };
                    
                    if (existingIndex >= 0) {
                        newPermissions[existingIndex] = {
                            ...newPermissions[existingIndex],
                            read: true,
                            write: req.write ? true : newPermissions[existingIndex].write
                        };
                    } else {
                        newPermissions.push(newPerm);
                    }
                });
                
                return newPermissions;
            });

            setSelectedPageAccessPermission(prev => [...prev, value]);
        }

        if (!isChecked) {
            setSelectedPageAccessPermission(prev => prev.filter(id => id !== value));

            setSelectedPermission(prevPermissions => {
                const rule = permissionRules.find(r => r.pageAccessId === value);
                if (!rule) return prevPermissions;

                const enabledPageAccesses = selectedPageAccessPermission.filter(id => id !== value);
                const newPermissions = [...prevPermissions];

                rule.requiredPermissions.forEach(req => {
                    const permissionId = req.permissionId;
                    const permIndex = newPermissions.findIndex(p => p.permissionId === permissionId);

                    if (permIndex >= 0) {
                        const stillRequired = isPermissionStillRequired(permissionId, enabledPageAccesses);
                        if (!stillRequired) {
                            newPermissions.splice(permIndex, 1);
                        } else {
                            const requiredForOthers = permissionRules
                            .filter(r => 
                                enabledPageAccesses.includes(r.pageAccessId) &&
                                r.requiredPermissions.some(rp => rp.permissionId === permissionId)
                            )
                            .flatMap(r => r.requiredPermissions.filter(rp => rp.permissionId === permissionId));

                            const minReadRequired = requiredForOthers.some(r => r.read);
                            const minWriteRequired = requiredForOthers.some(r => r.write);

                            newPermissions[permIndex] = {
                                ...newPermissions[permIndex],
                                read: minReadRequired,
                                write: minWriteRequired && newPermissions[permIndex].write
                            }
                        }
                    }
                });
                return newPermissions;
            });
        }
    }

    const handleTogglePermission = (permissionId: number, isChecked: boolean, type: string): void => {
        setSelectedPermission(prev => {
            // Existing permission update logic
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
            
            if (!updatedPermission.read && !updatedPermission.write) {
                return prev.filter(p => p.permissionId !== permissionId);
            }
            
            const newPermissions = [...prev];
            if (existingPermissionIndex >= 0) {
                newPermissions[existingPermissionIndex] = updatedPermission;
            } else {
                newPermissions.push(updatedPermission);
            }
            
            if (!isAdvanced) {
                const affectedPageAccesses = permissionRules
                    .filter(rule => 
                        rule.requiredPermissions.some(req => 
                            req.permissionId === permissionId && 
                            ((type === 'read' && req.read) || (type === 'write' && req.write))
                        )
                    )
                    .map(rule => rule.pageAccessId);
                
                if (affectedPageAccesses.length > 0) {
                    setTimeout(() => {
                        setSelectedPageAccessPermission(currentPageAccesses => {
                            return currentPageAccesses.filter(pageAccessId => {
                                if (!affectedPageAccesses.includes(pageAccessId)) return true;
                                return checkPageAccessRequirements(pageAccessId, newPermissions);
                            });
                        });
                    }, 0);
                }
            }
            
            return newPermissions;
        });
    };

    const resetSelectedPermissions = () : void => {
        setSelectedPageAccessPermission([]);
        setSelectedPermission([]);
        setIsAdvanced(false);
    }

    const handleSetAdvanced = (value : boolean) : void => {
        setIsAdvanced(value);
    }

    const handleSetPermisions = (value : RolePermission[]) => {
        setSelectedPermission(value)
    }

    const handleSetPageAccessPermissions = (value : number[]) => {
        setSelectedPageAccessPermission(value);
    }

    return {
        selectedPermission,
        selectedPageAccessPermission,
        isAdvanced,
        handleTogglePageAccessPermission,
        handleTogglePermission,
        resetSelectedPermissions,
        handleSetAdvanced,
        handleSetPermisions,
        handleSetPageAccessPermissions,
    }
}