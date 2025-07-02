import { useEffect, useState } from "react";
import { Button, Form, FormProps, SelectProps, Space, TableColumnsType, Tag } from "antd";

import { outletApi, tableApi } from "../../api";

import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { TableDataReturn } from "../../models/tableInterface";

// types and interfaces
export interface TableForm {
    tableName : string;
    pax : number;
}
export interface TablesTableData {
    key : number;
    tableName : string;
    pax : number;
    status : string;
}


export function useTableManagement() {

    const { tableId : tableIdFromParams } = useParams();
    const navigate = useNavigate();

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal } = useStaticModal();

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [getOutletLoad, setGetOutletLoad] = useState<boolean>(true);
    const [getTableGroupLoad, setGetTableGroupLoad] = useState<boolean>(true);
    const [getTableLoad, setGetTableLoad] = useState<boolean>(false);

    const [outletSelection, setOutletSelection] = useState<SelectProps['options']>([]);
    const [selectedOutlet, setSelectedOutlet] = useState<string>("");

    const [tableGroupSelection, setTableGroupSelection] = useState<SelectProps['options']>([]);
    const [selectedTableGroup, setSelectedTableGroup] = useState<number | null>(null);

    const [searchWord, setSearchWord] = useState<string>("");
    const [statusFilterData, setStatusFilterData] = useState<number | undefined>(undefined);

    const [tables, setTables] = useState<TablesTableData[]>([]);
    const [filteredTables, setFilteredTables] = useState<TablesTableData[]>([]);

    const [addTableModal, setAddTableModal] = useState<boolean>(false);
    const [editTableModal, setEditTableModal] = useState<boolean>(false);

    useEffect(() => {
        getOutletList();

        if (tableIdFromParams) editTableModalOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedOutlet === "") return;

        getTableGroupList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOutlet]);

    useEffect(() => {
        if (!selectedTableGroup) {
            setTables([]);
            return;
        }

        getTableData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTableGroup]);

    useEffect(() => {
        setFilteredTables(tables);
        setSearchWord("");
        setStatusFilterData(undefined);
    }, [tables]);

    useEffect(() => {
        if (getOutletLoad || getTableGroupLoad) return;
        setContentLoad(false);
    }, [getOutletLoad, getTableGroupLoad]);

    useEffect(() => {
        if (!searchWord && statusFilterData == undefined) return setFilteredTables(tables);

        let filterItems = tables;
        
        if (statusFilterData !== undefined) {
            const stringValue : string = statusFilterData == 1 ? t("global:active") : t("global:inactive");
            filterItems = filterItems.filter(data => data.status === stringValue);
        }

        if (searchWord) {
            filterItems = filterItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.tableName.toLocaleLowerCase().includes(input);
            });
        }

        setFilteredTables(filterItems);

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

    const columns: TableColumnsType<TablesTableData> = [
        {
            title: t("table:tableName"),
            dataIndex: 'tableName',
            sorter: (a, b) => a.tableName.localeCompare(b.tableName),
        },
        {
            title: t("table:pax"),
            dataIndex: 'pax',
            align: 'center',
            sorter: (a, b) => a.pax - b.pax,
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
            setGetOutletLoad(false);
        }
    }

    const getTableGroupList = async () : Promise<void> => {

        setGetTableGroupLoad(true);

        try {

            const [err, data] = await tableApi.getAllTableGroup(`outletId=${selectedOutlet}`);

            if (err) {
                serverErrorModal();
                return;
            }

            if (data.length === 0) {
                setSelectedTableGroup(null);
                setTableGroupSelection([]);
                return;
            }

            const activeOptions = data
                .filter(item => item.status === true)
                .map(item => ({
                    label: item.groupName,
                    value: item.id,
                }));

            const inactiveOptions = data
                .filter(item => item.status === false)
                .map(item => ({
                    label: item.groupName,
                    value: item.id,
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

            setTableGroupSelection(groupedOptions);

            const firstOption = activeOptions[0]?.value ?? inactiveOptions[0]?.value;
            if (firstOption) setSelectedTableGroup(firstOption);

        } finally {
            setGetTableGroupLoad(false);
        }
    }

    const getTableData = async () : Promise<void> => {
        if (!selectedTableGroup) return;

        setGetTableLoad(true);

        try {

            const [err, data] = await tableApi.getAllTable(`tableGroupId=${selectedTableGroup}`);

            if (err) {
                serverErrorModal();
                return;
            }

            const tableDataList : TablesTableData[] = [];
            data.forEach(item => {
                tableDataList.push({
                    key : item.tableId,
                    tableName : item.tableName,
                    pax : item.pax,
                    status : item.status ? t("global:active") : t("global:inactive"),
                });
            });

            setTables(tableDataList);
            setFilteredTables(tableDataList);

        } finally {
            setGetTableLoad(false);
        }
    }

    const handleChangeStatusFilter = (value : number) : void => {
        setStatusFilterData(value);
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
    }

    const handleSelectEdit = (tableId : number) : void => {
        navigate(`/table/${tableId}`, { replace: false });
        editTableModalOpen(true);
    }

    const handleChangeOutlet = async (outletId : string) : Promise<void> => {
        setSelectedOutlet(outletId);
    }

    const handleChangeTableGroup = async (tableGroupId : number) : Promise<void> => {
        setSelectedTableGroup(tableGroupId);
    }

    const addTableModalOpen = (open : boolean) : void => {
        setAddTableModal(open);
    }

    const editTableModalOpen = (open : boolean) : void => {
        setEditTableModal(open);

        if (!open) {
            navigate(`/table`);
        }
    }

    const onAddTableSuccess = (newTableGroup : TablesTableData) : void => {
        setTables(prev => [...prev, newTableGroup]);
        addTableModalOpen(false);
    }

    const onEditTableSuccess = (newData : TablesTableData) : void => {
        setTables(prevData =>
            prevData.map(item =>
                item.key === newData.key
                    ? newData
                    : item
            )
        );
        editTableModalOpen(false);
    }

    const onChangeStatusSuccess = (tableId : number, newStatus : boolean) : void => {
        setTables(prevData =>
            prevData.map(item =>
                item.key === tableId
                    ? { ...item, status: newStatus ? t("global:active") : t("global:inactive") }
                    : item
            )
        );
    }

    const onDeleteTableSuccess = (tableId : number) : void => {
        const filtered = tables.filter(item => item.key !== tableId);
        setTables(filtered);

        editTableModalOpen(false);
    }

    return {
        contentLoad,
        outletSelection,
        selectedOutlet,
        tableGroupSelection,
        selectedTableGroup,
        getTableGroupLoad,
        getTableLoad,
        statusOptions,
        columns,
        tables : filteredTables,
        addTableModal,
        editTableModal,
        searchWord,
        statusFilterData,
        handleChangeOutlet,
        handleChangeTableGroup,
        handleSearch,
        handleChangeStatusFilter,
        addTableModalOpen,
        editTableModalOpen,
        onAddTableSuccess,
        onEditTableSuccess,
        onChangeStatusSuccess,
        onDeleteTableSuccess,
    }
}



export function useAddTable(
    selectedTableGroup : number,
    onAddTableSuccess : (newTableGroup : TablesTableData) => void,
) {

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);

    const [addTableForm] = Form.useForm();

    const handleAddTable : FormProps<TableForm>['onFinish'] = async (values) : Promise<void> => {

        setLoading(true);

        try {

            const [err, data] = await tableApi.createTable({
                tableName : values.tableName,
                pax : values.pax,
                tableGroupId : selectedTableGroup,
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

            successnotification(t("table:addTableSuccess"));
            onAddTableSuccess({
                key : data.tableId,
                tableName : data.tableName,
                pax : data.pax,
                status : data.status ? t("global:active") : t("global:inactive"),
            });

            resetData();

        } finally {
            setLoading(false);
        } 
    }

    const resetData = () : void => {
        addTableForm.resetFields();
    }

    return {
        loading,
        addTableForm,
        handleAddTable,
        resetData,
    }
}


export function useEditTable(
    onEditTableSuccess : (newData : TablesTableData) => void,
    onChangeStatusSuccess : (tableId : number, newStatus : boolean) => void,
    onDeleteTableSuccess : (tableId : number) => void,
) {

    const { tableId : tableIdFromParams } = useParams();

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [tableData, setTableData] = useState<TableDataReturn | null>(null);

    const [editTableForm] = Form.useForm();

    useEffect(() => {
        getTableData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTableData = async () : Promise<void> => {
        if (!tableIdFromParams) return;

        try {

            const [err, data] = await tableApi.getOneTable(tableIdFromParams);

            if (err) {
                serverErrorModal();
                return;
            }

            setTableData(data);

        } finally {
            setContentLoad(false);
        }
    }

    const handleEditTable : FormProps<TableForm>['onFinish'] = async (values) : Promise<void> => {
        if (!tableIdFromParams) return;
        
        setSubmitLoad(true);

        try {
            
            const [err, data] = await tableApi.editTable({
                tableId : Number(tableIdFromParams),
                tableName : values.tableName,
                pax : values.pax
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

            successnotification(t("table:editTableSuccess"));
            onEditTableSuccess({
                key : data.tableId,
                tableName : data.tableName,
                pax : data.pax,
                status : data.status ? t("global:active") : t("global:inactive"),
            });

        } finally {
            setSubmitLoad(false);
        }
    }

    const handleChangeStatus = async (newStatus : boolean) : Promise<void> => {
        if (!tableIdFromParams) return;

        setLoading(true);

        try {

            const [err, data] = await tableApi.changeTableStatus({
                tableId : Number(tableIdFromParams),
                newStatus : newStatus
            });

            if (err) {
                serverErrorModal();
                return; 
            }

            onChangeStatusSuccess(Number(tableIdFromParams), data.newStatus);
            successnotification(`${t("table:statusChanged")} ${data.newStatus ? t("global:active") : t("global:inactive")}`);

            setTableData(prev => {
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
            onOkWithPromise : handleDeleteTable,
        });
    }

    const handleDeleteTable = async () : Promise<void> => {
        if (!tableIdFromParams) return;

        setLoading(true);

        try {

            const [err] = await tableApi.deleteTable(Number(tableIdFromParams));

            if (err) {
                serverErrorModal();
                return;
            }

            onDeleteTableSuccess(Number(tableIdFromParams));
            successnotification(t("table:deleteTableSuccess"));
            
        } finally {
            setLoading(false);
        }
    }

    return {
        contentLoad,
        submitLoad,
        loading,
        tableData,
        editTableForm,
        handleEditTable,
        handleChangeStatus,
        clickDeleteBtn,
    }
}