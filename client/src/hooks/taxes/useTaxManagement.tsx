import { useEffect, useState } from "react"

import { Button, Form, FormProps, Space, TableColumnsType, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";

import { taxApi, outletApi } from "../../api";

// types and interfaces
import { TaxCompleteDataReturn } from "../../models/taxInterface";
import { OutletSelectionData } from "../../models/globalInterface";
interface TaxForm {
    name : string;
    writtenName : string;
    amount : string;
}

const { Text } = Typography;

export function useTaxManagement() {

    const { taxId : taxIdFromParams } = useParams();

    const { t } = useTranslation(["global", "tax"]);
    const navigate = useNavigate();

    const { serverErrorModal } = useStaticModal();

    const [searchWord, setSearchWord] = useState<string>("");

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [getTaxLoad, setGetTaxLoad] = useState<boolean>(true);
    const [getOutletLoad, setGetOutletLoad] = useState<boolean>(true);

    const [taxes, setTaxes] = useState<TaxCompleteDataReturn[]>([]);
    const [filteredTaxes, setFilteredTaxes] = useState<TaxCompleteDataReturn[]>([]);

    const [outletSelection, setOutletSelection] = useState<OutletSelectionData[]>([]);

    const [addTaxModal, setAddTaxModal] = useState<boolean>(false);
    const [editTaxModal, setEditTaxModal] = useState<boolean>(false);

    useEffect(() => {
        getTaxData();
        getOutletList();

        if (taxIdFromParams) editTaxOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredTaxes(taxes);
        setSearchWord("");
    }, [taxes]);

    useEffect(() => {
        if (getTaxLoad || getOutletLoad) return;
        setContentLoad(false);
    }, [getTaxLoad, getOutletLoad]);

    useEffect(() => {
        if (!searchWord) return setFilteredTaxes(taxes);

        let filterItems = taxes;

        if (searchWord) {
            filterItems = filterItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.name.toLocaleLowerCase().includes(input) ||
                    data.writtenName.toLocaleLowerCase().includes(input)
            });
        }

        setFilteredTaxes(filterItems);

    }, [searchWord]);

    const columns: TableColumnsType<TaxCompleteDataReturn> = [
        {
            title: t("tax:name"),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: t("tax:writtenName"),
            dataIndex: 'writtenName',
            sorter: (a, b) => a.writtenName.localeCompare(b.writtenName),
        },
        {
            title: t("tax:amount"),
            dataIndex: 'amount',
            key: 'amount',
            render: (amount : string) => {
                return (
                    <Text strong>
                        {Number(amount)}%
                    </Text>
                )
            }
        },
        {
            title: t("tax:assignedOutlets"),
            dataIndex: 'assignedOutlets',
            key: 'assignedOutlets',
            render: (_item, record) => {
                return (
                    <Text strong>{record.outletIds.length} {t("tax:outlets")}</Text>
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
                            onClick={() => handleSelectEdit(record.taxId)}
                        >
                            {t("global:edit")}
                        </Button>
                    </Space>
                )
            }
        }
    ]

    const getTaxData = async () : Promise<void> => {
        try {

            const [err, data] = await taxApi.getAllTaxComplete();

            if (err) {
                serverErrorModal();
                return;
            }

            setTaxes(data);
            setFilteredTaxes(data);


        } finally {
            setGetTaxLoad(false);
        }
    }

    const getOutletList = async () : Promise<void> => {
        try {
            const [err, data] = await outletApi.getAllOutlet();

            if (err) {
                serverErrorModal();
                return;
            }

            const outletSelectionList : OutletSelectionData[] = [];
            data.forEach(item => {
                outletSelectionList.push({
                    outletId : item.outletId,
                    outletName : item.outletName,
                    status : item.status,
                });
            });

            setOutletSelection(outletSelectionList);

        } finally {
            setGetOutletLoad(false);
        }
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
    }

    const handleSelectEdit = (taxId : number) : void => {
        navigate(`/tax/${taxId}`, { replace: false });
        editTaxOpen(true);
    }

    const addTaxOpen = (open : boolean) => {
        setAddTaxModal(open);
    }

    const editTaxOpen = (open : boolean) => {
        setEditTaxModal(open);

        if (!open) {
            navigate(`/tax`);
        }
    }

    const onAddTaxSuccess = (newTax : TaxCompleteDataReturn) : void => {
        setTaxes(prev => [...prev, newTax]);
        addTaxOpen(false);
    }

    const onEditTaxSuccess = (newValue : TaxCompleteDataReturn) : void => {
        setTaxes(prevTax =>
            prevTax.map(item =>
                item.taxId === newValue.taxId ? newValue : item
            )
        );
        editTaxOpen(false);
    }

    const onDeleteTaxSuccess = (taxId : number) : void => {
        const filtered = taxes.filter(item => item.taxId !== taxId);
        setTaxes(filtered);
        editTaxOpen(false);
    }

    return {
        contentLoad,
        searchWord,
        taxes : filteredTaxes,
        columns,
        outletSelection,
        addTaxModal,
        editTaxModal,
        handleSearch,
        addTaxOpen,
        editTaxOpen,
        onAddTaxSuccess,
        onEditTaxSuccess,
        onDeleteTaxSuccess,
    }
}

export function useAddTax(
    onAddTaxSuccess : (newTax : TaxCompleteDataReturn) => void,
) {
    
    const { t } = useTranslation(["global", "tax"]);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);

    const [assignOutletModal, setAssignOutletModal] = useState<boolean>(false);
    const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectionData[]>([]);

    const [addTaxForm] = Form.useForm();

    const resetData = () : void => {
        addTaxForm.resetFields();
    }

    const openAssignOutletModal = (open : boolean) : void => {
        setAssignOutletModal(open);
    }

    const handleAssignSelectedOutlet = (tempSelectedOutlet : OutletSelectionData[]) : void => {
        setSelectedOutlet(tempSelectedOutlet);
        openAssignOutletModal(false);
    }

    const handleAddSalesType : FormProps<TaxForm>['onFinish'] = async (values) : Promise<void> => {
        console.log(values);
        console.log(selectedOutlet);

        setLoading(true);

        try {

            const [err, data] = await taxApi.createTax({
                name : values.name,
                writtenName : values.writtenName,
                amount : values.amount.toString(),
                outletIds : selectedOutlet.map(item => item.outletId),
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`tax:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("tax:addSuccess"));
            onAddTaxSuccess(data);

            resetData();

        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        addTaxForm,
        assignOutletModal,
        selectedOutlet,
        resetData,
        openAssignOutletModal,
        handleAssignSelectedOutlet,
        handleAddSalesType,
    }

}