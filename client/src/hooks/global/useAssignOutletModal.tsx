import { useEffect, useState } from "react";
import { SelectProps, TableColumnsType, TableProps, Tag } from "antd";

import { useTranslation } from "react-i18next";

// types and interfaces
import { OutletSelectionData } from "../../models/globalInterface";
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
export interface OutletSelectionTableData {
    key : string;
    outletName : string;
    status : string;
}


export default function useAssignOutletModal(
    outletSelection : OutletSelectionData[],
    selectedOutlet : OutletSelectionData[],
) {

    const { t } = useTranslation(["global", "outlet"]);
    
    const [tempSelectedOutlet, setTempSelectedOutlet] = useState<OutletSelectionData[]>([]);
    const [forTableOutletSelection, setForTableOutletSelection] = useState<OutletSelectionTableData[]>([]);
    const [filteredForTable, setFilteredForTable] = useState<OutletSelectionTableData[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        const keys = selectedOutlet.map(item => item.outletId);
        setSelectedRowKeys(keys);

        setTempSelectedOutlet(selectedOutlet);
        mapOutletSelectionToTable();
    }, []);

    useEffect(() => {
        setFilteredForTable(forTableOutletSelection);
    }, [forTableOutletSelection]);

    const columns: TableColumnsType<OutletSelectionTableData> = [
        {
            title: '#',
            dataIndex: 'rowIndex',
            rowScope: 'row',
            align: 'center',
            render: (_: any, __: OutletSelectionTableData, index: number) => index + 1,
        },
        {
            title: t("outlet:outletName"),
            dataIndex: 'outletName',
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
    ]

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

    const rowSelection: TableRowSelection<OutletSelectionTableData> = {
        selectedRowKeys,
        onChange: (newSelectedKeys, _selectedRows) => {
            setSelectedRowKeys(newSelectedKeys);
        },
        onSelect: (record, selected, _selectedRows) => {
            if (!selected) {
                const filtered = tempSelectedOutlet.filter(item => item.outletId !== record.key);
                setTempSelectedOutlet(filtered);

                return;
            }

            setTempSelectedOutlet(prev => [...prev, {
                outletId : record.key,
                outletName : record.outletName,
                status : record.status === t("global:active") ? true : false
            }]);
        },
        onSelectAll: (selected, _selectedRows, changeRows) => {
            if (!selected) {
                const unselectedIds = changeRows.map(item => item.key);
                const filtered = tempSelectedOutlet.filter(item => !unselectedIds.includes(item.outletId));
                setTempSelectedOutlet(filtered);

                return;
            }

            const changedRowList : OutletSelectionData[] = [];
            changeRows.forEach(item => {
                changedRowList.push({
                    outletId : item.key,
                    outletName : item.outletName,
                    status : item.status === t("global:active") ? true : false
                });
            });
            setTempSelectedOutlet(prev => [...prev, ...changedRowList]);
        },
    };

    const mapOutletSelectionToTable = () => {

        const outletSelectionList : OutletSelectionTableData[] = [];
        outletSelection.forEach(item => {
            outletSelectionList.push({
                key: item.outletId,
                outletName : item.outletName,
                status : item.status ? t("global:active") : t("global:inactive"),
            });
        });

        setForTableOutletSelection(outletSelectionList);
    }

    const handleSearch = (value : string) : void => {
        const filtered = forTableOutletSelection.filter(data => {
            const input = value.toLocaleLowerCase();
            return data.outletName.toLocaleLowerCase().includes(input)
        });
        setFilteredForTable(filtered);
        const keys = tempSelectedOutlet.map(item => item.outletId);
        setSelectedRowKeys(keys);
    }

    const handleChangeStatusFilter = (value : number) : void => {

        const keys = tempSelectedOutlet.map(item => item.outletId);
        setSelectedRowKeys(keys);

        if (value === undefined) return setFilteredForTable(forTableOutletSelection);

        const stringValue : string = value == 1 ? t("global:active") : t("global:inactive");
        const filtered = forTableOutletSelection.filter(data => data.status === stringValue);
        setFilteredForTable(filtered);
    }

    return {
        columns,
        rowSelection,
        tempSelectedOutlet,
        forTableOutletSelection : filteredForTable,
        statusOptions,
        handleSearch,
        handleChangeStatusFilter,
    }
}