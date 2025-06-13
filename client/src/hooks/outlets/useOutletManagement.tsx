import { useEffect, useState } from "react"

import { Button, Form, FormProps, SelectProps, Space, TableColumnsType, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";

import { outletApi } from "../../api";

// types and interfaces
export interface OutletForm {
    outletName : string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
}
export interface OutletTableData {
    key: string;
    outletName: string;
    address : string;
    city : string;
    province : string;
    postalCode : string;
    status : string;
}


export function useOutletManagement()  {

    const { t } = useTranslation(["global", "outlet"]);

    const { serverErrorModal } = useStaticModal();

    const [addOutletModal, setAddOutletModal] = useState<boolean>(false);

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [outlets, setOutlets] = useState<OutletTableData[]>([]);
    const [filteredOutlets, setFilteredOutlets] = useState<OutletTableData[]>([]);

    useEffect(() => {
        getOutletData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredOutlets(outlets);
    }, [outlets])

    const statusOptions : SelectProps['options'] = [
        {
            label : t("global:active"),
            value : 1
        },
        {
            label : t("global:unactive"),
            value : 0
        },
    ];

    const columns: TableColumnsType<OutletTableData> = [
        {
            title: t("outlet:outletName"),
            dataIndex: 'outletName',
            sorter: (a, b) => a.outletName.localeCompare(b.outletName),
        },
        {
            title: t("outlet:address"),
            dataIndex: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
        },
        {
            title: t("outlet:city"),
            dataIndex: 'city',
            sorter: (a, b) => a.city.localeCompare(b.city),
        },
        {
            title: t("outlet:province"),
            dataIndex: 'province',
            sorter: (a, b) => a.province.localeCompare(b.province),
        },
        {
            title: t("outlet:postalCode"),
            dataIndex: 'postalCode',
            sorter: (a, b) => a.postalCode.localeCompare(b.postalCode),
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
                            onClick={() => handleSelectEdit()}
                        >
                            {t("global:edit")}
                        </Button>
                    </Space>
                )
            }
        }
    ]

    const getOutletData = async () : Promise<void> => {

        try {
            const [err, data] = await outletApi.getAllOutlet();
    
            if (err) {
                serverErrorModal();
                return;
            }

            const outletTableDataList : OutletTableData[] = [];
            data.forEach(item => {
                outletTableDataList.push({
                    key : item.outletId,
                    outletName: item.outletName != "" ? item.outletName : "-",
                    address : item.address != "" ? item.address : "-",
                    city : item.city != "" ? item.city : "-",
                    province : item.province != "" ? item.province : "-",
                    postalCode : item.postalCode != "" ? item.postalCode : "-",
                    status : item.status ? t("global:active") : t("global:unactive")
                });
            });

            setOutlets(outletTableDataList);
            setFilteredOutlets(outletTableDataList);

        } finally {
            setContentLoad(false);
        }

    }

    const handleChangeStatusFilter = (value : number) : void => {
        if (value === undefined) return setFilteredOutlets(outlets);

        const stringValue : string = value == 1 ? t("global:active") : t("global:unactive")
        const filtered = outlets.filter(data => data.status === stringValue);
        setFilteredOutlets(filtered);
    }

    const handleSearch = (value : string) : void => {
        const filtered = outlets.filter(data => {
            const input = value.toLocaleLowerCase();
            return data.outletName.toLocaleLowerCase().includes(input) ||
                data.address.toLocaleLowerCase().includes(input) ||
                data.city.toLocaleLowerCase().includes(input) ||
                data.province.toLocaleLowerCase().includes(input) ||
                data.postalCode.toLocaleLowerCase().includes(input);
        });
        setFilteredOutlets(filtered);
    }

    const handleSelectEdit = () : void => {

    }

    const addOutletOpen = (open : boolean) => {
        setAddOutletModal(open);
    }

    const onAddOutletSuccess = (newOutlet : OutletTableData) : void => {
        setOutlets(prev => [...prev, newOutlet]);
        setAddOutletModal(false);
    }

    return {
        contentLoad,
        statusOptions,
        columns,
        outlets : filteredOutlets,
        addOutletModal,
        handleSearch,
        handleChangeStatusFilter,
        addOutletOpen,
        onAddOutletSuccess,
    }
}

export function useAddOutlet(onAddOutletSuccess : (newOutlet : OutletTableData) => void) {

    const { t } = useTranslation(["global", "outlet"]);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);
    
    const [form] = Form.useForm();

    const resetData = () : void => {
        form.resetFields();
    }

    const handleAddOutlet : FormProps<OutletForm>['onFinish'] = async (values) : Promise<void> => {
        
        setLoading(true);

        try {
            const [err, data] = await outletApi.createOutlet({
                outletName : values.outletName,
                address : values.address,
                city : values.city,
                province : values.province,
                postalCode : values.postalCode,
            });
            
            if (err) {

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`outlet:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("outlet:addSuccess"));
            onAddOutletSuccess({
                key : data.outletId,
                outletName: data.outletName != "" ? data.outletName : "-",
                address : data.address != "" ? data.address : "-",
                city : data.city != "" ? data.city : "-",
                province : data.province != "" ? data.province : "-",
                postalCode : data.postalCode != "" ? data.postalCode : "-",
                status : data.status ? t("global:active") : t("global:unactive"),
            });

        } finally {
            setLoading(false);
        }
    }
    
    return {
        form,
        loading,
        resetData,
        handleAddOutlet
    }
}