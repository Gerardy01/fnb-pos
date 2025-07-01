import { useEffect, useState } from "react"

import { Button, Form, FormProps, Space, TableColumnsType, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useNavigate } from "react-router-dom";

import { gratuityApi } from "../../api";

// utils
import { GratuityCalculationTypeEnum } from "../../utils/enums";
import { formatAmountToReadable } from "../../utils/utility";

// types and interfaces
export interface GratuityForm {
    name : string;
    writtenName: string;
    amount: number;
}
export interface GratuityTableData {
    key: number;
    name: string;
    writtenName: string;
    amount: string;
}

const { Text } = Typography;

export function useGratuityManagement() {

    const { t } = useTranslation(["global", "gratuity"]);
    const navigate = useNavigate();

    const { serverErrorModal } = useStaticModal();

    const [addGratuityModal, setAddGratuityModal] = useState<boolean>(false);
    const [editGratuityModal, setEditGratuityModal] = useState<boolean>(false);

    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [gratuities, setGratuities] = useState<GratuityTableData[]>([]);
    const [filteredGratuities, setFilteredGratuities] = useState<GratuityTableData[]>([]);

    useEffect(() => {
        getGratuityData();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredGratuities(gratuities);
    }, [gratuities]);

    const columns: TableColumnsType<GratuityTableData> = [
        {
            title: t("gratuity:name"),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: t("gratuity:writtenName"),
            dataIndex: 'writtenName',
            sorter: (a, b) => a.writtenName.localeCompare(b.writtenName),
        },
        {
            title: t("gratuity:amount"),
            dataIndex: 'amount',
            key: 'amount',
            render: (amount : string) => {
                return (
                    <Text strong>{amount}</Text>
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

    const getGratuityData = async () : Promise<void> => {
        try {

            const [err, data] = await gratuityApi.getAllGratuity();

            if (err) {
                serverErrorModal();
                return;
            }

            const gratuityTableDataList : GratuityTableData[] = [];
            data.forEach(item => {
                gratuityTableDataList.push({
                    key : item.gratuityId,
                    name : item.name,
                    writtenName : item.writtenName,
                    amount : 
                        item.calculationType == GratuityCalculationTypeEnum.PERCENT ?
                        `${Number(item.amount)}%` : `Rp. ${formatAmountToReadable(item.amount)}`
                });
            });

            setGratuities(gratuityTableDataList);
            setFilteredGratuities(gratuityTableDataList);

        } finally {
            setContentLoad(false);
        }
    }

    const handleSearch = (value : string) : void => {
        const filtered = gratuities.filter(data => {
            const input = value.toLocaleLowerCase();
            return data.name.toLocaleLowerCase().includes(input) ||
                data.writtenName.toLocaleLowerCase().includes(input)
        });
        setFilteredGratuities(filtered);
    }

    const handleSelectEdit = (gratuityId : number) : void => {
        navigate(`/gratuity/${gratuityId}`, { replace: false });
        editGratuityOpen(true);
    }

    const addGratuityOpen = (open : boolean) => {
        setAddGratuityModal(open);
    }

    const editGratuityOpen = (open : boolean) => {
        setEditGratuityModal(open);

        if (!open) {
            navigate(`/gratuity`);
        }
    }

    const onAddGratuitySuccess = (newGratuity : GratuityTableData) : void => {
        setGratuities(prev => [...prev, newGratuity]);
        addGratuityOpen(false);
    }

    return {
        contentLoad,
        columns,
        gratuities : filteredGratuities,
        addGratuityModal,
        editGratuityModal,
        handleSearch,
        addGratuityOpen,
        onAddGratuitySuccess
    }
}

export function useAddGratuity(
    onAddGratuitySuccess : (newGratuity : GratuityTableData) => void,
) {
    
    const { t } = useTranslation(["global", "gratuity"]);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);

    const [calculationType, setCalculationType] = useState<string>(`${GratuityCalculationTypeEnum.PERCENT}`);

    const [addGratuityForm] = Form.useForm();

    const resetData = () : void => {
        addGratuityForm.resetFields();
    }

    const handleAddGratuity : FormProps<GratuityForm>['onFinish'] = async (values) : Promise<void> => {
        
        setLoading(true);

        try {

            const [err, data] = await gratuityApi.createGratuity({
                name : values.name,
                writtenName : values.writtenName,
                amount : values.amount.toString(),
                calculationType : Number(calculationType),
            });

            if (err) {

                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`gratuity:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("gratuity:addSuccess"));
            onAddGratuitySuccess({
                key : data.gratuityId,
                name : data.name,
                writtenName : data.writtenName,
                amount : data.calculationType == GratuityCalculationTypeEnum.PERCENT ?
                        `${Number(data.amount)}%` : `Rp. ${formatAmountToReadable(data.amount)}`
            });

        } finally {
            setLoading(false);
        }

    }

    const handleCalculationTypeChange = (value: string) => {
        setCalculationType(value);
    };

    return {
        loading,
        addGratuityForm,
        calculationType,
        resetData,
        handleAddGratuity,
        handleCalculationTypeChange,
    }
}