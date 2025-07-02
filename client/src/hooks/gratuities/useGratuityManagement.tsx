import { useEffect, useState } from "react"

import { Button, Form, FormProps, SelectProps, Space, TableColumnsType, Typography } from "antd";
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
    calculationType : number;
}

const { Text } = Typography;

export function useGratuityManagement() {

    const { t } = useTranslation(["global", "gratuity"]);
    const navigate = useNavigate();

    const { serverErrorModal } = useStaticModal();

    const [addGratuityModal, setAddGratuityModal] = useState<boolean>(false);
    const [editGratuityModal, setEditGratuityModal] = useState<boolean>(false);

    const [searchWord, setSearchWord] = useState<string>("");
    const [calculationType, setCalculationType] = useState<number | undefined>(undefined);

    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [gratuities, setGratuities] = useState<GratuityTableData[]>([]);
    const [filteredGratuities, setFilteredGratuities] = useState<GratuityTableData[]>([]);

    useEffect(() => {
        getGratuityData();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredGratuities(gratuities);
        setSearchWord("");
        setCalculationType(undefined);
    }, [gratuities]);

    useEffect(() => {
        if (!searchWord && !calculationType) return setFilteredGratuities(gratuities);

        let filterItems = gratuities;

        if (calculationType) {
            filterItems = filterItems.filter(item => item.calculationType === calculationType);
        }

        if (searchWord) {
            filterItems = filterItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.name.toLocaleLowerCase().includes(input) ||
                    data.writtenName.toLocaleLowerCase().includes(input)
            });
        }

        setFilteredGratuities(filterItems);

    }, [searchWord, calculationType]);

    const calculationOptions : SelectProps['options'] = [
        {
            label : `${t("global:percentage")} (%)`,
            value : GratuityCalculationTypeEnum.PERCENT,
        },
        {
            label : `${t("global:fixed")} (Rp)`,
            value : GratuityCalculationTypeEnum.FIXED,
        },
    ];

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
            render: (amount : string, record) => {
                return (
                    <Text strong>
                        {record.calculationType === GratuityCalculationTypeEnum.PERCENT ?
                            `${Number(amount)}%` : `Rp. ${formatAmountToReadable(amount)}`}
                    </Text>
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
                    amount : item.amount,
                    calculationType : item.calculationType,
                });
            });

            setGratuities(gratuityTableDataList);
            setFilteredGratuities(gratuityTableDataList);

        } finally {
            setContentLoad(false);
        }
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
    }

    const handleChangeCalculationTypeFilter = (value : number) : void => {
        setCalculationType(value);
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
        calculationOptions,
        searchWord,
        calculationType,
        handleSearch,
        addGratuityOpen,
        handleChangeCalculationTypeFilter,
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
                amount : data.amount,
                calculationType : data.calculationType,
            });

            resetData();

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