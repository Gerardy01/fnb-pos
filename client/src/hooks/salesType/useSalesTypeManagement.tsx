import { useEffect, useState } from "react";

import { Button, Form, FormProps, Select, SelectProps, Space, TableColumnsType, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useNavigate, useParams } from "react-router-dom";

import { gratuityApi, outletApi, salesTypeApi } from "../../api";

// types and interfaces
import { AssignedGratuities, SalesTypeCompleteDataReturn } from "../../models/salesTypeInterface";
import { OutletSelectionData } from "../../models/globalInterface";
export interface SalesTypeForm {
    name : string;
}
export interface SalesTypeTableData {
    key: number;
    name: string;
    outletIds : string[];
    assignedGratuities : AssignedGratuities[];
}
interface MultipleGratuities {
    outletId : string;
    gratuityIds : number[];
}

const { Text } = Typography;


export function useSalesTypeManagement() {

    const { salesTypeId : salesTypeIdFromParams } = useParams();

    const { t } = useTranslation(['global', 'salesType']);
    const navigate = useNavigate();

    const { serverErrorModal } = useStaticModal();

    const [addSalesTypeModal, setAddSalesTypeModal] = useState<boolean>(false);
    const [editSalesTypeModal, setEditSalesTypeModal] = useState<boolean>(false);

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [getSalesTypeLoad, setGetSalesTypeLoad] = useState<boolean>(true);
    const [getGratuityLoad, setGetGratuityLoad] = useState<boolean>(true);
    const [getOutletLoad, setGetOutletLoad] = useState<boolean>(true);

    const [searchWord, setSearchWord] = useState<string>("");

    const [outletSelection, setOutletSelection] = useState<OutletSelectionData[]>([]);
    const [gratuityOption, setGratuityOption] = useState<SelectProps['options']>([]);

    const [salesTypes, setSalesTypes] = useState<SalesTypeTableData[]>([]);
    const [filteredSalesTypes, setFilteredSalesTypes] = useState<SalesTypeTableData[]>([]);

    useEffect(() => {
        getSalesTypeData();
        getOutletList();
        getGratuityList();

        if (salesTypeIdFromParams) editSalesTypeOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredSalesTypes(salesTypes);
        setSearchWord("");
    }, [salesTypes]);

    useEffect(() => {
        if (getSalesTypeLoad || getGratuityLoad || getOutletLoad) return;
        setContentLoad(false);
    }, [getSalesTypeLoad, getGratuityLoad, getOutletLoad]);

    useEffect(() => {
        if (!searchWord) return setFilteredSalesTypes(salesTypes);

        let filterItems = salesTypes;

        if (searchWord) {
            filterItems = filterItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.name.toLocaleLowerCase().includes(input) ||
                    data.name.toLocaleLowerCase().includes(input)
            });
        }

        setFilteredSalesTypes(filterItems);

    }, [searchWord]);

    const columns: TableColumnsType<SalesTypeTableData> = [
        {
            title: t("salesType:name"),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: t("salesType:assignedGratuities"),
            dataIndex: 'assignedGratuities',
            key: 'assignedGratuities',
            render: (item, record) => {
                if (item.length == 0 || item[0].outletId === null) {
                    const gratuityCount = item.length;
                    return (
                        <Text strong>
                            {gratuityCount} {t("salesType:gratuities")}
                        </Text>
                    )
                }

                const gratuityIds = item.map((e : AssignedGratuities) => e.gratuityId);
                const uniqueGratuities = Array.from(new Set(gratuityIds));
                return (
                    <div style={{ display : 'flex', flexDirection: 'column' }}>
                        <Text strong>{uniqueGratuities.length} {t("salesType:gratuities")}</Text>
                        <Text>{t("salesType:accross")} {record.outletIds.length} {t("salesType:outlets")}</Text>
                    </div>
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

    const getSalesTypeData = async () : Promise<void> => {
        try {

            const [err, data] = await salesTypeApi.getAllSalesTypeComplete();

            if (err) {
                serverErrorModal();
                return;
            }

            const salesTypeTableDataList : SalesTypeTableData[] = [];
            data.forEach(item => {
                salesTypeTableDataList.push({
                    key : item.salesTypeId,
                    name : item.name,
                    outletIds : item.outletIds,
                    assignedGratuities : item.assignedGratuities,
                });
            });

            setSalesTypes(salesTypeTableDataList);
            setFilteredSalesTypes(salesTypeTableDataList);

        } finally {
            setGetSalesTypeLoad(false);
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

    const getGratuityList = async () : Promise<void> => {
        try {

            const [err, data] = await gratuityApi.getAllGratuity();

            if (err) {
                serverErrorModal();
                return;
            }

            const gratuitySelectionList : SelectProps['options'] = [];
            data.forEach(item => {
                gratuitySelectionList.push({
                    label : item.name,
                    value : item.gratuityId,
                });
            });

            setGratuityOption(gratuitySelectionList);

        } finally {
            setGetGratuityLoad(false);
        }
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
    }

    const handleSelectEdit = (salesTypeId : number) : void => {
        navigate(`/sales-type/${salesTypeId}`, { replace: false });
        editSalesTypeOpen(true);
    }

    const addSalesTypeOpen = (open : boolean) => {
        setAddSalesTypeModal(open);
    }

    const editSalesTypeOpen = (open : boolean) => {
        setEditSalesTypeModal(open);

        if (!open) {
            navigate(`/sales-type`);
        }
    }

    const onAddSalesTypeSuccess = (newSalesType : SalesTypeTableData) : void => {
        setSalesTypes(prev => [...prev, newSalesType]);
        addSalesTypeOpen(false);
    }

    const onEditSalesTypeSuccess = (newValue : SalesTypeTableData) : void => {
        setSalesTypes(prevSalesType =>
            prevSalesType.map(item =>
                item.key === newValue.key ? newValue : item
            )
        );
        editSalesTypeOpen(false);
    }

    const onDeleteSalesTypeSuccess = (salesTypeId : number) : void => {
        const filtered = salesTypes.filter(item => item.key !== salesTypeId);
        setSalesTypes(filtered);
        editSalesTypeOpen(false);
    }

    return {
        contentLoad,
        columns,
        salesTypes : filteredSalesTypes,
        searchWord,
        addSalesTypeModal,
        editSalesTypeModal,
        outletSelection,
        gratuityOption,
        handleSearch,
        addSalesTypeOpen,
        editSalesTypeOpen,
        onAddSalesTypeSuccess,
        onEditSalesTypeSuccess,
        onDeleteSalesTypeSuccess,
    }
}

export function useAddSalesType(
    gratuityOption : SelectProps['options'],
    onAddSalesTypeSuccess : (newSalesType : SalesTypeTableData) => void,
) {

    const { t } = useTranslation(["global", "salesType"]);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);

    const [assignOutletModal, setAssignOutletModal] = useState<boolean>(false);

    const [selectOutletErrorMsg, setSelectOutletErrorMsg] = useState<string>("");
    const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectionData[]>([]);

    const [addSalesTypeForm] = Form.useForm();

    const {
        selectedGratuities,
        diffGratuityOutlet,
        gratuityAssignationCols,
        handleChangeGratuitySelection,
        changeDiffGratuityOutlet,
        getAssignedGratuities,
        resetAssignedGratuities,
    } = useGratuitySelection(gratuityOption);

    const resetData = () : void => {
        addSalesTypeForm.resetFields();
        setSelectedOutlet([]);
        resetAssignedGratuities();
        changeDiffGratuityOutlet(false);
    }

    const openAssignOutletModal = (open : boolean) : void => {
        setAssignOutletModal(open);
    }

    const handleAssignSelectedOutlet = (tempSelectedOutlet : OutletSelectionData[]) : void => {
        setSelectedOutlet(tempSelectedOutlet);
        openAssignOutletModal(false);
        setSelectOutletErrorMsg("");
    }

    const handleAddSalesType : FormProps<SalesTypeForm>['onFinish'] = async (values) : Promise<void> => {
        if (selectedOutlet.length === 0) {
            setSelectOutletErrorMsg(t("account:noOutletErrMsg"));
            return;
        }

        setLoading(true);

        try {

            const [err, data] = await salesTypeApi.createSalesType({
                name : values.name,
                outletIds : selectedOutlet.map(item => item.outletId),
                assignedGratuities : getAssignedGratuities(),
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`salesType:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("salesType:addSuccess"));
            onAddSalesTypeSuccess({
                key : data.salesTypeId,
                name: data.name,
                outletIds : data.outletIds,
                assignedGratuities : data.assignedGratuities,
            });

            resetData();

        } finally {
            setLoading(false);
        }
    }

    return {
        addSalesTypeForm,
        selectedOutlet,
        selectOutletErrorMsg,
        assignOutletModal,
        selectedGratuities,
        diffGratuityOutlet,
        gratuityAssignationCols,
        loading,
        openAssignOutletModal,
        resetData,
        handleAssignSelectedOutlet,
        handleAddSalesType,
        handleChangeGratuitySelection,
        changeDiffGratuityOutlet,
    }
}

export function useEditSalesType(
    outletSelection : OutletSelectionData[],
    gratuityOption : SelectProps['options'],
    onEditSalesTypeSuccess : (newValue : SalesTypeTableData) => void,
    onDeleteSalesTypeSuccess : (salesTypeId : number) => void,
) {

    const { salesTypeId : salesTypeIdFromParams } = useParams();

    const { t } = useTranslation(["global", "salesType"]);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const {
        selectedGratuities,
        diffGratuityOutlet,
        gratuityAssignationCols,
        handleChangeGratuitySelection,
        changeDiffGratuityOutlet,
        getAssignedGratuities,
        resetAssignedGratuities,
        handleSetGratuitySelectionMultiple,
    } = useGratuitySelection(gratuityOption);

    const [salesTypeData, setSalesTypeData] = useState<SalesTypeCompleteDataReturn | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [assignOutletModal, setAssignOutletModal] = useState<boolean>(false);

    const [selectOutletErrorMsg, setSelectOutletErrorMsg] = useState<string>("");
    const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectionData[]>([]);

    const [editSalesTypeForm] = Form.useForm();

    useEffect(() => {
        getSalesTypeData();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!salesTypeData) return;

        mapAssignedGratuities();

        const filterSelected = outletSelection.filter(item => salesTypeData.outletIds.includes(item.outletId));
        setSelectedOutlet(filterSelected);

    }, [salesTypeData])

    const getSalesTypeData = async () : Promise<void> => {
        if (!salesTypeIdFromParams) return;

        try {

            const [err, data] = await salesTypeApi.getOneSalesType(Number(salesTypeIdFromParams));

            if (err) {
                if (err.status === 404) return;

                serverErrorModal();
                return;
            }

            setSalesTypeData(data);

        } finally {
            setContentLoad(false);
        }
    }

    const resetData = () : void => {
        editSalesTypeForm.resetFields();
        setSelectedOutlet([]);
        changeDiffGratuityOutlet(false);
    }

    const openAssignOutletModal = (open : boolean) : void => {
        setAssignOutletModal(open);
    }

    const handleAssignSelectedOutlet = (tempSelectedOutlet : OutletSelectionData[]) : void => {
        setSelectedOutlet(tempSelectedOutlet);
        openAssignOutletModal(false);
        setSelectOutletErrorMsg("");
        resetAssignedGratuities();
    }

    const mapAssignedGratuities = () : void => {
        if (!salesTypeData) return;
        if (salesTypeData.assignedGratuities.length === 0) return;

        if (!salesTypeData.assignedGratuities[0].outletId) {
            handleChangeGratuitySelection(
                salesTypeData.assignedGratuities.map(item => item.gratuityId)
            )
            return;
        }

        changeDiffGratuityOutlet(true);
        let assignedList : MultipleGratuities[] = [];
        salesTypeData.assignedGratuities.forEach(item => {
            if (!item.outletId) return;
            
            const prevData = assignedList.find(e => e.outletId === item.outletId);
            if (!prevData) {
                assignedList.push({
                    outletId : item.outletId,
                    gratuityIds : [item.gratuityId],
                });
                return;
            }

            const filtered = assignedList.filter(e => e.outletId !== item.outletId);
            assignedList = [...filtered, {
                outletId : item.outletId,
                gratuityIds : [...prevData.gratuityIds, item.gratuityId]
            }]
        });
        handleSetGratuitySelectionMultiple(assignedList);
    }

    const handleEditSalesType : FormProps<SalesTypeForm>['onFinish'] = async (values) : Promise<void> => {
        if (!salesTypeIdFromParams) return;

        if (selectedOutlet.length === 0) {
            setSelectOutletErrorMsg(t("account:noOutletErrMsg"));
            return;
        }

        setSubmitLoad(true);

        try {

            const [err, data] = await salesTypeApi.editSalesType({
                salesTypeId : Number(salesTypeIdFromParams),
                name : values.name,
                outletIds : selectedOutlet.map(item => item.outletId),
                assignedGratuities : getAssignedGratuities(),
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`salesType:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("salesType:editSuccess"));
            onEditSalesTypeSuccess({
                key : data.salesTypeId,
                name: data.name,
                outletIds : data.outletIds,
                assignedGratuities : data.assignedGratuities,
            });

            resetData();

        } finally {
            setSubmitLoad(false);
        }
    }

    const clickDeleteBtn = async () : Promise<void> => {
        confirmationModal({
            title : t("salesType:sureDeleteGratuity"),
            content: t("salesType:deleteGratuityDesc"),
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : handleDeleteSalesType,
        });
    }

    const handleDeleteSalesType = async () : Promise<void> => {
        if (!salesTypeIdFromParams) return;

        setLoading(true);

        try {
            
            const [err] = await salesTypeApi.deleteSalesType(Number(salesTypeIdFromParams));

            if (err) {
                serverErrorModal();
                return;
            }

            onDeleteSalesTypeSuccess(Number(salesTypeIdFromParams));
            successnotification(t("salesType:deleteSuccess"));

        } catch(e) {
            setLoading(false);
        }
    }

    return {
        loading,
        submitLoad,
        contentLoad,
        salesTypeData,
        editSalesTypeForm,
        assignOutletModal,
        selectedOutlet,
        selectOutletErrorMsg,
        diffGratuityOutlet,
        selectedGratuities,
        gratuityAssignationCols,
        resetData,
        openAssignOutletModal,
        handleAssignSelectedOutlet,
        handleChangeGratuitySelection,
        changeDiffGratuityOutlet,
        handleEditSalesType,
        clickDeleteBtn,
    }
}

function useGratuitySelection(
    gratuityOption : SelectProps['options'],
) {

    const { t } = useTranslation(["global", "salesType"]);

    const [diffGratuityOutlet, setDiffGratuityOutlet] = useState<boolean>(false);
    
    const [selectedGratuities, setSelectedGratuities] = useState<number[]>([]);
    const [selectedGratuitiesMultiple, setSelectedGratuitiesMultiple] = useState<MultipleGratuities[]>([]);

    const columns: TableColumnsType<OutletSelectionData> = [
        {
            title: '#',
            dataIndex: 'rowIndex',
            rowScope: 'row',
            align: 'center',
            render: (_: any, __: OutletSelectionData, index: number) => index + 1,
        },
        {
            title: t("salesType:outlet"),
            dataIndex: 'outletName',
        },
        {
            title: t('salesType:gratuities'),
            key: 'gratuities',
            render: (_, record) => {

                const currentData : MultipleGratuities | undefined = selectedGratuitiesMultiple.find(item => item.outletId === record.outletId);
                const gratuities = currentData == undefined ? [] : currentData.gratuityIds;

                return (
                    <Space size="middle">
                        <Select
                            style={{ width: '400px' }}
                            placeholder={t("salesType:selectGratuity")}
                            mode="multiple" 
                            value={gratuities}
                            allowClear
                            options={gratuityOption}
                            onChange={value => {
                                if (!currentData) {
                                    setSelectedGratuitiesMultiple(prev => [...prev, {
                                        outletId : record.outletId,
                                        gratuityIds : value,
                                    }]);
                                    return
                                }

                                const filtered = selectedGratuitiesMultiple.filter(item => item.outletId !== record.outletId);
                                setSelectedGratuitiesMultiple([...filtered, {
                                    outletId : record.outletId,
                                    gratuityIds : value,
                                }]);
                            }}
                            filterOption={(input, option) =>
                                (option?.label as string).toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Space>
                )
            }
        },
    ]

    const handleChangeGratuitySelection = (value: number[]) : void => {
        setSelectedGratuities(value);
    }

    const handleSetGratuitySelectionMultiple = (value : MultipleGratuities[]) : void => {
        setSelectedGratuitiesMultiple(value);
    }

    const changeDiffGratuityOutlet = (value : boolean) : void => {
        setDiffGratuityOutlet(value);
    }

    const getAssignedGratuities = () : AssignedGratuities[] => {
        if (!diffGratuityOutlet) {
            const assignedList : AssignedGratuities[] = [];
            selectedGratuities.forEach(item => {
                assignedList.push({
                    outletId : null,
                    gratuityId : item
                });
            });
            return assignedList;
        }

        const assignedList : AssignedGratuities[] = [];
        selectedGratuitiesMultiple.forEach(item => {
            item.gratuityIds.forEach(gratuityId => {
                assignedList.push({
                    outletId : item.outletId,
                    gratuityId : gratuityId,
                });
            })
        });
        return assignedList;
    }

    const resetAssignedGratuities = () : void => {
        setSelectedGratuities([]);
        setSelectedGratuitiesMultiple([]);
    }

    return {
        selectedGratuities,
        diffGratuityOutlet,
        gratuityAssignationCols : columns,
        handleChangeGratuitySelection,
        changeDiffGratuityOutlet,
        getAssignedGratuities,
        resetAssignedGratuities,
        handleSetGratuitySelectionMultiple,
    }
}