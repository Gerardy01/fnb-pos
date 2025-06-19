import { useEffect, useState } from "react"

import { Button, Form, FormProps, SelectProps, Space, TableColumnsType, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useNavigate, useParams } from "react-router-dom";

import { outletApi } from "../../api";

// types and interfaces
import { OutletDataReturn } from "../../models/outletInterface";
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

    const { outletId : outletIdFormParams } = useParams();

    const navigate = useNavigate();
    const { t } = useTranslation(["global", "outlet"]);

    const { serverErrorModal } = useStaticModal();

    const [addOutletModal, setAddOutletModal] = useState<boolean>(false);
    const [editOutletModal, setEditOutletModal] = useState<boolean>(false);

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [outlets, setOutlets] = useState<OutletTableData[]>([]);
    const [filteredOutlets, setFilteredOutlets] = useState<OutletTableData[]>([]);

    useEffect(() => {
        getOutletData();

        if (outletIdFormParams) editOutletOpen(true);
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
            label : t("global:inactive"),
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
                            onClick={() => handleSelectEdit(record.key)}
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
                    status : item.status ? t("global:active") : t("global:inactive")
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

        const stringValue : string = value == 1 ? t("global:active") : t("global:inactive")
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

    const handleSelectEdit = (outletId : string) : void => {
        navigate(`/outlet/${outletId}`, { replace: false });
        editOutletOpen(true);
    }

    const addOutletOpen = (open : boolean) => {
        setAddOutletModal(open);
    }

    const editOutletOpen = (open : boolean) => {
        setEditOutletModal(open);

        if (!open) {
            navigate(`/outlet`);
        }
    }

    const onAddOutletSuccess = (newOutlet : OutletTableData) : void => {
        setOutlets(prev => [...prev, newOutlet]);
        addOutletOpen(false);
    }

    const onEditOutletSuccess = (newValue : OutletTableData) : void => {
        setOutlets(prevOutlets =>
            prevOutlets.map(item =>
                item.key === newValue.key ? newValue : item
            )
        );
        editOutletOpen(false);
    }

    const onDeleteOutletSuccess = (outletId : string) : void => {
        const filtered = outlets.filter(item => item.key !== outletId);
        setOutlets(filtered);
        editOutletOpen(false);
    }

    const onChangeStatusSuccess = (outletId : string, newStatus : boolean) : void => {
        setOutlets(prevOutlets =>
            prevOutlets.map(outlet =>
                outlet.key === outletId
                    ? { ...outlet, status: newStatus ? t("global:active") : t("global:inactive") }
                    : outlet
            )
        );
    }

    return {
        contentLoad,
        statusOptions,
        columns,
        outlets : filteredOutlets,
        addOutletModal,
        editOutletModal,
        outletIdFormParams,
        handleSearch,
        handleChangeStatusFilter,
        addOutletOpen,
        editOutletOpen,
        onAddOutletSuccess,
        onEditOutletSuccess,
        onDeleteOutletSuccess,
        onChangeStatusSuccess,
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

                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

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
                status : data.status ? t("global:active") : t("global:inactive"),
            });

            resetData();

        } finally {
            setLoading(false);
        }
    }
    
    return {
        addOutletForm : form,
        loading,
        resetData,
        handleAddOutlet
    }
}

export function useEditOutlet(
    onEditSuccess : (newValue : OutletTableData) => void,
    onDeleteSuccess : (outletId : string) => void,
    onChangeStatusSuccess : (outletId : string, newStatus : boolean) => void,
) {
    
    const { outletId : outletIdFormParams } = useParams();

    const { t } = useTranslation(["global", "outlet"]);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const [outletData, setOutletData] = useState<OutletDataReturn | null>(null);

    const [form] = Form.useForm();

    useEffect(() => {
        getOutletData();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getOutletData = async () : Promise<void> => {
        if (!outletIdFormParams) return;

        try {
            const [err, data] = await outletApi.getOneOutlet(outletIdFormParams);

            if (err) {

                if (err.status === 404) return;

                serverErrorModal();
                return;
            }

            setOutletData(data);

        } finally {
            setContentLoad(false);
        }
    }

    const handleEditOutlet : FormProps<OutletForm>['onFinish'] = async (values) : Promise<void> => {
        setSubmitLoad(true);

        try {
            const [err, data] = await outletApi.editOutlet({
                outletId : outletIdFormParams ? outletIdFormParams : "",
                outletName : values.outletName,
                address : values.address,
                city : values.city,
                province : values.province,
                postalCode : values.postalCode,
            });

            if (err) {

                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`outlet:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("outlet:editSuccess"));
            onEditSuccess({
                key : data.outletId,
                outletName: data.outletName != "" ? data.outletName : "-",
                address : data.address != "" ? data.address : "-",
                city : data.city != "" ? data.city : "-",
                province : data.province != "" ? data.province : "-",
                postalCode : data.postalCode != "" ? data.postalCode : "-",
                status : data.status ? t("global:active") : t("global:inactive"),
            });

        } finally {
            setSubmitLoad(false);
        }
    }

    const clickDeleteBtn = async () : Promise<void> => {
        confirmationModal({
            title : t("outlet:sureDeleteOutlet"),
            content: t("outlet:deleteOutletDesc"),
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : handleDeleteOutlet,
        });
    }

    const handleDeleteOutlet = async () : Promise<void> => {
        if (!outletIdFormParams) return;

        setLoading(true);

        try {
            
            const [err] = await outletApi.deleteOutlet(outletIdFormParams);

            if (err) {
                serverErrorModal();
                return;
            }

            onDeleteSuccess(outletIdFormParams);
            successnotification(t("outlet:deleteSuccess"));

        } finally {
            setLoading(false);
        }
    }

    const handleChangeStatus = async (newStatus : boolean) : Promise<void> => {
        if (!outletIdFormParams) return;

        setLoading(true);

        try {
            const [err, data] = await outletApi.changeOutletStatus({
                outletId : outletIdFormParams,
                newStatus : newStatus,
            });

            if (err) {
                serverErrorModal();
                return; 
            }

            onChangeStatusSuccess(outletIdFormParams, data.newStatus);
            successnotification(`${t("outlet:statusChanged")} ${data.newStatus ? t("global:active") : t("global:inactive")}`);

            setOutletData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status : newStatus
                }
            });

        } finally {
            setLoading(false);
        }
    }

    return {
        contentLoad,
        outletData,
        editOutletForm : form,
        submitLoad,
        loading,
        handleEditOutlet,
        clickDeleteBtn,
        handleChangeStatus,
    }
}