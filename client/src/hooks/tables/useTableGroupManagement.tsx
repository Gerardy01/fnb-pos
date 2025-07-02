import { useEffect, useState } from "react";
import { Button, Form, FormProps, SelectProps, Space, TableColumnsType, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { outletApi, tableApi } from "../../api";

import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

// types and interfaces
import { TableGroupDataReturn } from "../../models/tableInterface";
export interface TableGroupForm {
    groupName : string;
}
export interface TableGroupsTableData {
    key: number;
    groupName : string;
    assignedTable : number;
    status : string;
}


export function useTableGroupManagement() {

    const { tableGroupId : tableGroupIdFromParams } = useParams();
    const navigate = useNavigate();

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal } = useStaticModal();

    const [addTableGroupModal, setAddTableGroupModal] = useState<boolean>(false);
    const [editTableGroupModal, setEditTableGroupModal] = useState<boolean>(false);

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [getTableGroupLoad, setGetTableGroupLoad] = useState<boolean>(false);

    const [searchWord, setSearchWord] = useState<string>("");
    const [statusFilterData, setStatusFilterData] = useState<number | undefined>(undefined);

    const [outletSelection, setOutletSelection] = useState<SelectProps['options']>([]);
    const [selectedOutlet, setSelectedOutlet] = useState<string>("");

    const [tableGroups, setTableGroups] = useState<TableGroupsTableData[]>([]);
    const [filteredTableGroups, setFilteredTableGroups] = useState<TableGroupsTableData[]>([]);

    useEffect(() => {
        getOutletList();

        if (tableGroupIdFromParams) editTableGroupModalOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedOutlet === "") return;
        getTableGroupData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOutlet]);

    useEffect(() => {
        setFilteredTableGroups(tableGroups);
        setSearchWord("");
        setStatusFilterData(undefined);
    }, [tableGroups]);

    useEffect(() => {
        if (!searchWord && statusFilterData == undefined) return setFilteredTableGroups(tableGroups);
        
        let filterItems = tableGroups;

        if (statusFilterData !== undefined) {
            const stringValue : string = statusFilterData == 1 ? t("global:active") : t("global:inactive");
            filterItems = filterItems.filter(data => data.status === stringValue);
        }

        if (searchWord) {
            filterItems = filterItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.groupName.toLocaleLowerCase().includes(input);
            });
        }

        setFilteredTableGroups(filterItems);

    }, [searchWord, statusFilterData])

    const statusOptions : SelectProps['options'] = [
        {
            label : t("global:active"),
            value : 1
        },
        {
            label : t("global:inactive"),
            value : 0
        },
    ];

    const columns: TableColumnsType<TableGroupsTableData> = [
        {
            title: t("table:groupName"),
            dataIndex: 'groupName',
            sorter: (a, b) => a.groupName.localeCompare(b.groupName),
        },
        {
            title: t("table:assignedTable"),
            dataIndex: 'assignedTable',
            align: 'center',
            sorter: (a, b) => a.assignedTable - b.assignedTable,
        },
        {
            title: t("global:status"),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => {
                return (
                    <Tag color={status === t("global:active") ? "green" : "red"}>
                        {status}
                    </Tag>
                )
            }
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
                            onClick={() => handleSelectEdit(record.key)}
                        >
                            {t("global:edit")}
                        </Button>
                    </Space>
                )
            }
        }
    ]

    const getOutletList = async () : Promise<void> => {

        try {
            const [err, data] = await outletApi.getAllOutlet();

            if (err) {
                serverErrorModal();
                return;
            }

            const activeOptions = data
                .filter(item => item.status === true)
                .map(item => ({
                    label: item.outletName,
                    value: item.outletId,
                }));

            const inactiveOptions = data
                .filter(item => item.status === false)
                .map(item => ({
                    label: item.outletName,
                    value: item.outletId,
                }));

            const groupedOptions: SelectProps['options'] = [];

            if (activeOptions.length > 0) {
                groupedOptions.push({
                    label: t("global:active"),
                    title: t("global:active"),
                    options: activeOptions,
                });
            }

            if (inactiveOptions.length > 0) {
                groupedOptions.push({
                    label: t("global:inactive"),
                    title: t("global:inactive"),
                    options: inactiveOptions,
                });
            }

            setOutletSelection(groupedOptions);

            const firstOption = activeOptions[0]?.value ?? inactiveOptions[0]?.value;
            if (firstOption) setSelectedOutlet(firstOption);

        } finally {
            setContentLoad(false);
        }
    }

    const getTableGroupData = async () : Promise<void> => {

        setGetTableGroupLoad(true);

        try {
            
            const [err, data] = await tableApi.getAllTableGroup(`outletId=${selectedOutlet}&includeTableCount=true`);

            if (err) {
                serverErrorModal();
                return;
            }

            const tableGroupList : TableGroupsTableData[] = [];
            data.forEach(item => {
                tableGroupList.push({
                    key: item.id,
                    groupName : item.groupName,
                    assignedTable : item.tableCount,
                    status : item.status ? t("global:active") : t("global:inactive"),
                });
            });

            setTableGroups(tableGroupList);
            setFilteredTableGroups(tableGroupList);

        } finally {
            setGetTableGroupLoad(false);
        }
    }

    const handleChangeStatusFilter = (value : number) : void => {
        setStatusFilterData(value);
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
    }

    const handleSelectEdit = (tableGroupId : number) : void => {
        navigate(`/table-group/${tableGroupId}`, { replace: false });
        editTableGroupModalOpen(true);
    }

    const handleChangeOutlet = async (outletId : string) : Promise<void> => {
        setSelectedOutlet(outletId);
    }

    const addTableGroupModalOpen = (open : boolean) : void => {
        setAddTableGroupModal(open);
    }

    const editTableGroupModalOpen = (open : boolean) : void => {
        setEditTableGroupModal(open);

        if (!open) {
            navigate(`/table-group`);
        }
    }

    const onAddTableGroupSuccess = (newTableGroup : TableGroupsTableData) : void => {
        setTableGroups(prev => [...prev, newTableGroup]);
        addTableGroupModalOpen(false);
    }

    const onEditTableGroupSuccess = (newData : TableGroupsTableData) : void => {
        setTableGroups(prevData =>
            prevData.map(item =>
                item.key === newData.key
                    ? {
                        ...newData,
                        assignedTable: item.assignedTable ?? 0
                    }
                    : item
            )
        );
        editTableGroupModalOpen(false);
    }

    const onChangeStatusSuccess = (tableGroupId : number, newStatus : boolean) : void => {
        setTableGroups(prevData =>
            prevData.map(item =>
                item.key === tableGroupId
                    ? { ...item, status: newStatus ? t("global:active") : t("global:inactive") }
                    : item
            )
        );
    }

    const onDeleteTableGroupSuccess = (tableGroupId : number) : void => {
        const filtered = tableGroups.filter(item => item.key !== tableGroupId);
        setTableGroups(filtered);

        editTableGroupModalOpen(false);
    }

    return {
        contentLoad,
        outletSelection,
        selectedOutlet,
        statusOptions,
        columns,
        tableGroups : filteredTableGroups,
        getTableGroupLoad,
        addTableGroupModal,
        editTableGroupModal,
        searchWord,
        statusFilterData,
        handleChangeOutlet,
        addTableGroupModalOpen,
        editTableGroupModalOpen,
        handleChangeStatusFilter,
        handleSearch,
        onAddTableGroupSuccess,
        onEditTableGroupSuccess,
        onChangeStatusSuccess,
        onDeleteTableGroupSuccess,
    }
}



export function useAddTableGroup(
    selectedOutlet : string,
    onAddTableGroupSuccess : (newTableGroup : TableGroupsTableData) => void,
) {

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);

    const [addTableGroupForm] = Form.useForm();

    const handleAddTableGroup : FormProps<TableGroupForm>['onFinish'] = async (values) : Promise<void> => {
        
        setLoading(true);

        try {

            const [err, data] = await tableApi.createTableGroup({
                groupName: values.groupName,
                outletId: selectedOutlet,
            });

            if (err) {

                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`table:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("table:addTableGroupSuccess"));   
            onAddTableGroupSuccess({
                key : data.id,
                groupName : data.groupName,
                assignedTable : data.tableCount,
                status : data.status ? t("global:active") : t("global:inactive"),
            });

            resetData();

        } finally {
            setLoading(false);
        }
    }

    const resetData = () : void => {
        addTableGroupForm.resetFields();
    }

    return {
        addTableGroupForm,
        loading,
        handleAddTableGroup,
        resetData,
    }
}

export function useEditTableGroup(
    onEditTableGroupSuccess : (newData : TableGroupsTableData) => void,
    onChangeStatusSuccess : (tableGroupId : number, newStatus : boolean) => void,
    onDeleteTableGroupSuccess : (tableGroupId : number) => void,
) {

    const { tableGroupId : tableGroupIdFromParams } = useParams();

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [tableGroupData, setTableGroupData] = useState<TableGroupDataReturn | null>(null);

    const [editTableGroupForm] = Form.useForm();

    useEffect(() => {
        getTableGroupData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTableGroupData = async () : Promise<void> => {
        if (!tableGroupIdFromParams) return;

        try {

            const [err, data] = await tableApi.getOneTableGroup(Number(tableGroupIdFromParams));

            if (err) {
                serverErrorModal();
                return;
            }

            setTableGroupData(data);

        } finally {
            setContentLoad(false);
        }
    }

    const handleEditTableGroup : FormProps<TableGroupForm>['onFinish'] = async (values) : Promise<void> => {
        if (!tableGroupIdFromParams) return;

        setSubmitLoad(true);

        try {
            
            const [err, data] = await tableApi.editTableGroup({
                id : Number(tableGroupIdFromParams),
                groupName : values.groupName,
            });

            if (err) {

                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`table:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }
            
            successnotification(t("table:editTableGroupSuccess"));
            onEditTableGroupSuccess({
                key: data.id,
                groupName : data.groupName,
                assignedTable : 0,
                status : data.status ? t("global:active") : t("global:inactive"),
            });

        } finally {
            setSubmitLoad(false);
        }
    }

    const handleChangeStatus = async (newStatus : boolean) : Promise<void> => {
        if (!tableGroupIdFromParams) return;

        setLoading(true);

        try {

            const [err, data] = await tableApi.changeTableGroupStatus({
                id: Number(tableGroupIdFromParams),
                newStatus : newStatus
            });

            if (err) {
                serverErrorModal();
                return; 
            }

            onChangeStatusSuccess(Number(tableGroupIdFromParams), data.newStatus);
            successnotification(`${t("table:statusChanged")} ${data.newStatus ? t("global:active") : t("global:inactive")}`);

            setTableGroupData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status : newStatus,
                }
            });

        } finally {
            setLoading(false);
        }
    }

    const clickDeleteBtn = async () : Promise<void> => {
        confirmationModal({
            title : t("table:sureDeleteTableGroup"),
            content: t("table:deleteTableGroupDesc"),
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : handleDeleteTableGroup,
        });
    }

    const deleteWithTableConfirmation = async () : Promise<void> => {
        confirmationModal({
            title : t("table:tableExist"),
            content: t("table:tableExistDesc"),
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : () => handleDeleteTableGroup(true),
        });
    }

    const handleDeleteTableGroup = async (deleteUnder? : boolean) : Promise<void> => {
        if (!tableGroupIdFromParams) return;

        setLoading(true);

        try {

            const [err] = await tableApi.deleteTableGroup(Number(tableGroupIdFromParams), `deleteUnder=${deleteUnder ?? false}`);

            if (err) {

                if (err.status === 403) {
                    deleteWithTableConfirmation();
                    return;
                }

                serverErrorModal();
                return;
            }

            onDeleteTableGroupSuccess(Number(tableGroupIdFromParams));
            successnotification(t("table:deleteSuccess"));

        } finally {
            setLoading(false);
        }
    }

    return {
        contentLoad,
        tableGroupData,
        editTableGroupForm,
        submitLoad,
        loading,
        handleEditTableGroup,
        handleChangeStatus,
        clickDeleteBtn,
    }
}