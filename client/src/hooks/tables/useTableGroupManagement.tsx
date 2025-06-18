import { useEffect, useState } from "react";
import { Button, SelectProps, Space, TableColumnsType, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { outletApi, tableApi } from "../../api";

import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useTranslation } from "react-i18next";

// types and interfaces
export interface TableGroupsTableData {
    key: number;
    groupName : string;
    assignedTable : number;
    status : string;
}


export function useTableGroupManagement() {

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [getTableGroupLoad, setGetTableGroupLoad] = useState<boolean>(false);

    const [outletSelection, setOutletSelection] = useState<SelectProps['options']>([]);
    const [selectedOutlet, setSelectedOutlet] = useState<string>("");

    const [tableGroups, setTableGroups] = useState<TableGroupsTableData[]>([]);

    useEffect(() => {
        getOutletList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedOutlet === "") return;
        getTableGroupData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOutlet]);

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
                            // onClick={}
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

            const groupedOptions: SelectProps['options'] = [
                {
                    label: t("global:active"),
                    title: t("global:active"),
                    options: activeOptions,
                },
                {
                    label: t("global:inactive"),
                    title: t("global:inactive"),
                    options: inactiveOptions,
                },
            ];

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
            
            const [err, data] = await tableApi.getAllTableGroup(`outletId=${selectedOutlet}`);

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

        } finally {
            setGetTableGroupLoad(false);
        }
    }

    const handleChangeOutlet = async (outletId : string) : Promise<void> => {
        setSelectedOutlet(outletId);
    }

    return {
        contentLoad,
        outletSelection,
        selectedOutlet,
        statusOptions,
        columns,
        tableGroups,
        getTableGroupLoad,
        handleChangeOutlet,
    }
}