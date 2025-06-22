import { useEffect, useState } from "react";
import { Button, SelectProps, Space, TableColumnsType, Tag } from "antd";

import { outletApi, tableApi } from "../../api";

import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

// types and interfaces
export interface TablesTableData {
    key : number;
    tableName : string;
    pax : number;
    status : string;
}


export function useTableManagement() {

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

    const [tables, setTables] = useState<TablesTableData[]>([]);
    const [filteredTables, setFilteredTables] = useState<TablesTableData[]>([]);

    useEffect(() => {
        getOutletList();

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
    }, [tables]);

    useEffect(() => {
        if (getOutletLoad || getTableGroupLoad) return;
        setContentLoad(false);
    }, [getOutletLoad, getTableGroupLoad]);

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
                            // onClick={() => handleSelectEdit(record.key)}
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

    const handleChangeOutlet = async (outletId : string) : Promise<void> => {
        setSelectedOutlet(outletId);
    }

    const handleChangeTableGroup = async (tableGroupId : number) : Promise<void> => {
        setSelectedTableGroup(tableGroupId);
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
        handleChangeOutlet,
        handleChangeTableGroup,
    }
}