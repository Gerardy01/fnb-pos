import { useEffect, useState } from "react"

import { Button, Form, FormInstance, FormProps, Input, InputNumber, Space, TableColumnsType, Tooltip, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";

import { modifierApi } from "../../api";

// types and interfaces
import { IModifierOption, ModifierDataReturn } from "../../models/modifierInterface";
export interface ModifierTableData {
    key : number;
    name : string;
    modifierOptions : IModifierOption[];
}
interface ModifierForm {
    name : string;
    min : number;
    max : number;
}
interface ModifierOptionTable {
    key : number;
    optionName : string;
    price : string;
}

const { Text } = Typography;

export function useModifierManagement() {

    const { modifierId : modifierIdFromParams } = useParams();

    const { t } = useTranslation(["global", "modifier"]);
    const navigate = useNavigate();

    const { serverErrorModal } = useStaticModal();
    
    const [searchWord, setSearchWord] = useState<string>("");

    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [modifiers, setModifiers] = useState<ModifierTableData[]>([]);
    const [filteredModifiers, setFilteredModifiers] = useState<ModifierTableData[]>([]);

    const [addModifierModal, setAddModifierModal] = useState<boolean>(false);
    const [editModifierModal, setEditModifierModal] = useState<boolean>(false);

    useEffect(() => {
        getModifierData();

        if (modifierIdFromParams) editModifierOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredModifiers(modifiers);
        setSearchWord("");
    }, [modifiers]);

    useEffect(() => {
        if (!searchWord) return setFilteredModifiers(modifiers);

        let filterItems = modifiers;

        if (searchWord) {
            filterItems = filterItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.name.toLocaleLowerCase().includes(input)
            });
        }

        setFilteredModifiers(filterItems);

    }, [searchWord]);

    const columns: TableColumnsType<ModifierTableData> = [
        {
            title: t("modifier:name"),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: t("modifier:options"),
            dataIndex: 'modifierOptions',
            key: 'modifierOptions',
            render: (_item, record) => {

                const optionNames = record.modifierOptions.map(option => option.optionName).join(', ');

                return (
                    <Tooltip title={optionNames}>
                        <Text ellipsis style={{ maxWidth: 200, display: 'inline-block' }}>
                            {optionNames}
                        </Text>
                    </Tooltip>
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

    const getModifierData = async () : Promise<void> => {
        try {

            const [err, data] = await modifierApi.getAllModifier("includeOptions=true");

            if (err) {
                serverErrorModal();
                return;
            }

            const modifierDataList : ModifierTableData[] = [];
            data.forEach(item => {
                modifierDataList.push({
                    key : item.modifierId,
                    name : item.name,
                    modifierOptions : item.modifierOptions,
                });
            });

            setModifiers(modifierDataList);
            setFilteredModifiers(modifierDataList);

        } finally {
            setContentLoad(false);
        }
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
    }

    const handleSelectEdit = (modifierId : number) : void => {
        navigate(`/modifier/${modifierId}`, { replace: false });
        editModifierOpen(true);
    }

    const addModifierOpen = (open : boolean) => {
        setAddModifierModal(open);
    }

    const editModifierOpen = (open : boolean) => {
        setEditModifierModal(open);

        if (!open) {
            navigate(`/modifier`);
        }
    }

    const onAddModifierSuccess = (newModifier : ModifierTableData) : void => {
        setModifiers(prev => [...prev, newModifier]);
        addModifierOpen(false);
    }

    const onEditModifierSuccess = (newValue : ModifierTableData) : void => {
        setModifiers(prevModifier =>
            prevModifier.map(item =>
                item.key === newValue.key ? newValue : item
            )
        );
        editModifierOpen(false);
    }

    const onDeleteModifierSuccess = (modifierId : number) : void => {
        const filtered = modifiers.filter(item => item.key !== modifierId);
        setModifiers(filtered);
        editModifierOpen(false);
    }

    return {
        contentLoad,
        searchWord,
        modifiers : filteredModifiers,
        columns,
        addModifierModal,
        editModifierModal,
        handleSearch,
        addModifierOpen,
        editModifierOpen,
        onAddModifierSuccess,
        onEditModifierSuccess,
        onDeleteModifierSuccess,
    }
}

export function useAddModifier(
    onAddModifierSuccess : (newModifier : ModifierTableData) => void,
) {

    const { t } = useTranslation(["global", "modifier"]);
    
    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [addModifierForm] = Form.useForm();

    const [loading, setLoading] = useState<boolean>(false);
    const [modifierOptionErrMsg, setModifierOptionErrMsg] = useState<string>("");

    const [limitChoices, setLimitChoices] = useState<boolean>(false);

    const {
        required,
        handleChangeRequired,
    } = handleRequired(addModifierForm);

    const {
        optionColumns,
        optionData,
        resetOptions,
        handleAddOption,
        validateOptions,
    } = handleOptions(addModifierForm, limitChoices);

    const resetData = () : void => {
        addModifierForm.resetFields();
        handleChangeRequired(false);
        resetOptions();
        changeLimitChoices(false, true);
    }
    
    const handleAddModifier : FormProps<ModifierForm>['onFinish'] = async (values) : Promise<void> => {

        if (!validateOptions()) {
            setModifierOptionErrMsg(t("modifier:modifierOptionErrMsg"))
            return;
        } else {
            setModifierOptionErrMsg("");
        }

        setLoading(true);

        try {

            const [err, data] = await modifierApi.createModifier({
                name : values.name,
                modifierOptions: optionData,
                required : required,
                min : values.min,
                max : values.max,
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`modifier:${err.response.data.message}`));
                    return;
                }

                if (err.status === 403) {
                    errorModal(t('global:failed'), t(`modifier:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("modifier:addSuccess"));
            onAddModifierSuccess({
                key : data.modifierId,
                name : data.name,
                modifierOptions : data.modifierOptions,
            });

            resetData();

        } finally {
            setLoading(false);
        }

    }

    const changeLimitChoices = (value : boolean, dataReset? : boolean) : void => {
        setLimitChoices(value);

        if (!value) {
            addModifierForm.setFieldValue('min', required ? 1 : 0);
            addModifierForm.setFieldValue('max', dataReset ? 1 : optionData.length);
        }
    }

    return {
        loading,
        addModifierForm,
        required,
        optionColumns,
        optionData,
        limitChoices,
        modifierOptionErrMsg,
        resetData,
        handleAddModifier,
        handleChangeRequired,
        handleAddOption,
        changeLimitChoices,
    }
}

export function useEditModifier(
    onEditModifierSuccess : (newValue : ModifierTableData) => void,
    onDeleteModifierSuccess : (modifierId : number) => void,
) {

    const { modifierId : modifierIdFromParams } = useParams();

    const { t } = useTranslation(["global", "modifier"]);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [modifierData, setModifierData] = useState<ModifierDataReturn | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [modifierOptionErrMsg, setModifierOptionErrMsg] = useState<string>("");

    const [limitChoices, setLimitChoices] = useState<boolean>(false);

    const [editModifierForm] = Form.useForm();

    const {
        required,
        handleChangeRequired,
    } = handleRequired(editModifierForm);

    const {
        optionColumns,
        optionData,
        resetOptions,
        handleAddOption,
        validateOptions,
        handleBulkSetOptions,
    } = handleOptions(editModifierForm, limitChoices);

    useEffect(() => {
        getModifierData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getModifierData = async () : Promise<void> => {
        if (!modifierIdFromParams) return;

        try {

            const [err, data] = await modifierApi.getOneModifier(Number(modifierIdFromParams));

            if (err) {
                if (err.status === 404) return;

                serverErrorModal();
                return;
            }

            setModifierData(data);
            handleChangeRequired(data.required);
            handleBulkSetOptions(data.modifierOptions);

            if (data.min > 1 || data.max < data.modifierOptions.length) {
                setLimitChoices(true);
            }

        } finally {
            setContentLoad(false);
        }
    }

    const resetData = () : void => {
        editModifierForm.resetFields();
        handleChangeRequired(false);
        resetOptions();
        changeLimitChoices(false, true);
    }

    const handleEditModifier : FormProps<ModifierForm>['onFinish'] = async (values) : Promise<void> => {
        if (!modifierIdFromParams) return;

        if (!validateOptions()) {
            setModifierOptionErrMsg(t("modifier:modifierOptionErrMsg"))
            return;
        } else {
            setModifierOptionErrMsg("");
        }

        setSubmitLoad(true);

        try {

            const [err, data] = await modifierApi.editModifier({
                modifierId : Number(modifierIdFromParams),
                name : values.name,
                modifierOptions : optionData,
                required : required,
                min : values.min,
                max : values.max,
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`modifier:${err.response.data.message}`));
                    return;
                }

                if (err.status === 403) {
                    errorModal(t('global:failed'), t(`modifier:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("modifier:editSuccess"));
            onEditModifierSuccess({
                key : data.modifierId,
                name : data.name,
                modifierOptions : data.modifierOptions,
            });

        } finally {
            setSubmitLoad(false);
        }
    }

    const clickDeleteBtn = async () : Promise<void> => {
        confirmationModal({
            title : t("modifier:sureDeleteModifier"),
            content: t("modifier:deleteModifierDesc"),
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : handleDeleteModifier,
        });
    }

    const handleDeleteModifier = async () : Promise<void> => {
        if (!modifierIdFromParams) return;

        setLoading(true);

        try {

            const [err] = await modifierApi.deleteModifier(Number(modifierIdFromParams));

            if (err) {
                serverErrorModal();
                return;
            }

            onDeleteModifierSuccess(Number(modifierIdFromParams));
            successnotification(t("modifier:deleteSuccess"));

        } finally {
            setLoading(false);
        }
    }

    const changeLimitChoices = (value : boolean, dataReset? : boolean) : void => {
        setLimitChoices(value);

        if (!value) {
            editModifierForm.setFieldValue('min', required ? 1 : 0);
            editModifierForm.setFieldValue('max', dataReset ? 1 : optionData.length);
        }
    }

    return {
        modifierData,
        loading,
        submitLoad,
        contentLoad,
        editModifierForm,
        required,
        optionColumns,
        optionData,
        limitChoices,
        modifierOptionErrMsg,
        resetData,
        handleEditModifier,
        clickDeleteBtn,
        handleChangeRequired,
        handleAddOption,
        changeLimitChoices,
    }
}

function handleRequired(form: FormInstance) {

    const [required, setRequired] = useState<boolean>(false);

    const handleChangeRequired = (required : boolean) : void => {
        setRequired(required);

        if (!required) {
            form.setFieldValue('min', 0);
            return;
        }

        form.setFieldValue('min', 1);
    }

    return {
        required,
        handleChangeRequired,
    }
}

function handleOptions(form: FormInstance, limitChoices : boolean) {

    const { t } = useTranslation(["global", "modifier"]);

    const [options, setOptions] = useState<ModifierOptionTable[]>([]);

    useEffect(() => {
        resetOptions();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const optionColumns: TableColumnsType<ModifierOptionTable> = [
        {
            title: t("modifier:optionName"),
            dataIndex: 'optionName',
            key: 'optionName',
            render: (value, record) => {
                return (
                    <Input
                        placeholder={t('modifier:name')}
                        maxLength={100}
                        value={value}
                        onChange={e => changeName(record.key, e.target.value)}
                    />
                )
            }
        },
        {
            title: `${t("modifier:price")} (Rp)`,
            dataIndex: 'price',
            key: 'price',
            render: (value, record) => {
                return (
                    <InputNumber
                        min={0}
                        max={9999999999999}
                        placeholder="0"
                        prefix={"Rp"}
                        value={value}
                        onChange={e => changePrice(record.key, e)}
                        style={{ width: '95%' }}
                    />
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
                            color="danger"
                            variant="link"
                            onClick={() => handleRemoveOption(record.key)}
                        >
                            {t("global:remove")}
                        </Button>
                    </Space>
                )
            }
        }
    ]

    const resetOptions = () : void => {
        setOptions([
            {
                key: 0,
                optionName : "",
                price : "",
            }
        ]);
    }

    const handleBulkSetOptions = (optionData : IModifierOption[]) => {
        const modifierOptionList : ModifierOptionTable[] = [];
        let key = 0;

        optionData.forEach(item => {
            modifierOptionList.push({
                key : key,
                optionName : item.optionName,
                price : item.price,
            });
            key++;
        });

        setOptions(modifierOptionList);
    }

    const handleRemoveOption = (key : number) : void => {
        if (options.length <= 1) return;

        if (!limitChoices) {
            form.setFieldValue('max', options.length - 1);
        }

        if (limitChoices) {
            const currentMaxValue = form.getFieldValue('max');
            if (currentMaxValue > options.length - 1) {
                form.setFieldValue('max', options.length - 1 );
            }
        }

        const filtered = options.filter(item => item.key !== key);
        setOptions(filtered);
    }

    const handleAddOption = () : void => {
        if (options.length == 20 || options.length == 0) return;
        
        if (!limitChoices) {
            form.setFieldValue('max', options.length + 1);
        }

        const lastDataKey = options[options.length - 1].key;
        setOptions(prev => [...prev, {
            key: lastDataKey + 1,
            optionName : "",
            price : "",
        }]);
    }

    const changeName = (key : number, newValue : string) : void => {
        setOptions(prev =>
            prev.map(item =>
                item.key !== key ? item : {
                    ...item,
                    optionName : newValue,
                }
            )
        )
    }

    const changePrice = (key : number, newValue : number) : void => {
        setOptions(prev =>
            prev.map(item =>
                item.key !== key ? item : {
                    ...item,
                    price : newValue ? newValue.toString() : "",
                }
            )
        )
    }

    const validateOptions = () : boolean => {
        const invalidOptions = options.filter(
            item => 
                item.optionName === "" ||
                item.price === "" ||
                item.price === "0"
        );

        if (invalidOptions.length > 0) return false;
        return true;
    }

    return {
        optionColumns,
        optionData : options,
        resetOptions,
        handleAddOption,
        validateOptions,
        handleBulkSetOptions,
    }
}