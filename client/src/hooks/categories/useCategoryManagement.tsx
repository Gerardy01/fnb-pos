import { useEffect, useState } from "react"

import { Button, Form, FormProps, Space, TableColumnsType, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { useNavigate, useParams } from "react-router-dom"
import useStaticModal from "../useStaticModal";
import { useTranslation } from "react-i18next";

// types and interfaces
import { CategoryDataReturn } from "../../models/categoryInterface";
import { categoryApi } from "../../api";
import useNotification from "../useNotification";
interface CategoryForm {
    name : string;
}
export interface CategoryTableData {
    key : number;
    name : string;
    menuCount : number
}

const { Text } = Typography;

export function useCategoryManagement() {

    const { categoryId : categoryIdFromParams } = useParams();

    const { t } = useTranslation(["global", "category"]);
    const navigate = useNavigate();

    const { serverErrorModal } = useStaticModal();

    const [searchWord, setSearchWord] = useState<string>("");

    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [categories, setCategories] = useState<CategoryTableData[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryTableData[]>([]);


    const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
    const [editCategoryModal, setEditCategroyModal] = useState<boolean>(false);

    useEffect(() => {
        getCategoryData();

        if (categoryIdFromParams) editCategoryOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredCategories(categories);
        setSearchWord("");
    }, [categories]);

    useEffect(() => {
        if (!searchWord) return setFilteredCategories(categories);

        let filterItems = categories;

        if (searchWord) {
            filterItems = filterItems.filter(data => {
                const input = searchWord.toLocaleLowerCase();
                return data.name.toLocaleLowerCase().includes(input)
            });
        }

        setFilteredCategories(filterItems);

    }, [searchWord]);

    const columns: TableColumnsType<CategoryTableData> = [
        {
            title: t("category:name"),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: t("category:menuCount"),
            dataIndex: 'menuCount',
            key: 'menuCount',
            align: 'center',
            sorter: (a, b) => a.menuCount - b.menuCount,
            render: (item) => {
                return (
                    <Text strong>{item} {t("tax:menus")}</Text>
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

    const getCategoryData = async () : Promise<void> => {
        try {
            
            const [err, data] = await categoryApi.getAllCategory();

            if (err) {
                serverErrorModal();
                return;
            }

            const categoryDataList : CategoryTableData[] = [];
            data.forEach(item => {
                categoryDataList.push({
                    key : item.categoryId,
                    name : item.name,
                    menuCount : item.itemCount ?? 0,
                });
            });

            setCategories(categoryDataList);
            setFilteredCategories(categoryDataList);

        } finally {
            setContentLoad(false);
        }
    }

    const handleSearch = (value : string) : void => {
        setSearchWord(value);
    }

    const handleSelectEdit = (categoryId : number) : void => {
        navigate(`/category/${categoryId}`, { replace: false });
        editCategoryOpen(true);
    }

    const addCategoryOpen = (open : boolean) => {
        setAddCategoryModal(open);
    }

    const editCategoryOpen = (open : boolean) => {
        setEditCategroyModal(open);

        if (!open) {
            navigate(`/category`);
        }
    }

    const onAddCategorySuccess = (newCategory : CategoryTableData) : void => {
        setCategories(prev => [...prev, newCategory]);
        addCategoryOpen(false);
    }

    const onEditCategorySuccess = (newValue : CategoryTableData) : void => {
        setCategories(prevCategory =>
            prevCategory.map(item =>
                item.key === newValue.key ? newValue : item
            )
        );
        editCategoryOpen(false);
    }

    const onDeleteCategorySuccess = (categoryId : number) : void => {
        const filtered = categories.filter(item => item.key !== categoryId);
        setCategories(filtered);
        editCategoryOpen(false);
    }

    return {
        contentLoad,
        searchWord,
        categories : filteredCategories,
        columns,
        addCategoryModal,
        editCategoryModal,
        handleSearch,
        addCategoryOpen,
        editCategoryOpen,
        onAddCategorySuccess,
        onEditCategorySuccess,
        onDeleteCategorySuccess,
    }
}

export function useAddCategory(
    onAddCategorySuccess : (newCategory : CategoryTableData) => void,
) {
    
    const { t } = useTranslation(["global", "category"]);

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);

    const [addCategoryForm] = Form.useForm();

    const resetData = () : void => {
        addCategoryForm.resetFields();
    }

    const handleAddCategory : FormProps<CategoryForm>['onFinish'] = async (values) : Promise<void> => {
        
        setLoading(true);

        try {

            const [err, data] = await categoryApi.createCategory({
                name : values.name,
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`category:${err.response.data.message}`));
                    return;
                }

                serverErrorModal();
                return;
            }

            successnotification(t("category:addSuccess"));
            onAddCategorySuccess({
                key : data.categoryId,
                name : data.name,
                menuCount : data.itemCount ?? 0,
            });

            resetData();

        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        addCategoryForm,
        resetData,
        handleAddCategory,
    }
}

export function useEditCategory(
    onEditCategorySuccess : (newValue : CategoryTableData) => void,
    onDeleteCategorySuccess : (categoryId : number) => void,
) {

    const { categoryId : categoryIdFromParams } = useParams();

    const { t } = useTranslation(["global", "category"]);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [categoryData, setCategoryData] = useState<CategoryDataReturn | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [contentLoad, setContentLoad] = useState<boolean>(true);

    const [editCategoryForm] = Form.useForm();

    useEffect(() => {
        getCategoryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCategoryData = async () : Promise<void> => {
        if (!categoryIdFromParams) return;

        try {

            const [err, data] = await categoryApi.getOneCategory(Number(categoryIdFromParams));

            if (err) {
                if (err.status === 404) return;

                serverErrorModal();
                return;
            }

            setCategoryData(data);

        } finally {
            setContentLoad(false);
        }
    }

    const resetData = () : void => {
        editCategoryForm.resetFields();
    }

    const handleEditCategory: FormProps<CategoryForm>['onFinish'] = async (values) : Promise<void> => {
        if (!categoryIdFromParams) return;

        setSubmitLoad(true);

        try {
            const [err, data] = await categoryApi.editCategory({
                categoryId : Number(categoryIdFromParams),
                name : values.name,
            });
    
            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }
    
                if (err.status === 409) {
                    errorModal(t('global:failed'), t(`category:${err.response.data.message}`));
                    return;
                }
    
                serverErrorModal();
                return;
            }
    
            successnotification(t("category:editSuccess"));
            onEditCategorySuccess({
                key : data.categoryId,
                name : data.name,
                menuCount : data.itemCount ?? 0,
            });

        } finally {
            setSubmitLoad(false);
        }
    }

    const clickDeleteBtn = async () : Promise<void> => {
        confirmationModal({
            title : t("category:sureDeleteCategory"),
            content: t("category:deleteCategoryDesc"),
            okBtn: t("global:yes"),
            cancelBtn: t("global:cancel"),
            centered: true,
            okBtnDanger: true,
            onOkWithPromise : handleDeleteCategory,
        });
    }

    const handleDeleteCategory = async () : Promise<void> => {
        if (!categoryIdFromParams) return;

        setLoading(true);

        try {

            const [err] = await categoryApi.deleteCategory(Number(categoryIdFromParams));

            if (err) {
                serverErrorModal();
                return;
            }

            onDeleteCategorySuccess(Number(categoryIdFromParams));
            successnotification(t("category:deleteSuccess"));

        } finally {
            setLoading(false);
        }
    }

    return {
        categoryData,
        loading,
        submitLoad,
        contentLoad,
        editCategoryForm,
        resetData,
        handleEditCategory,
        clickDeleteBtn,
    }
}