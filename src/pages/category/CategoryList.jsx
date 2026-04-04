import {Alert, Snackbar} from "@mui/material";
import {useTranslation} from "react-i18next";
import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import TableCus from "../../components/table/TableCus.jsx";
import {useDispatch, useSelector} from "react-redux";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import * as Yup from "yup";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setProductionLineDataForUpdate
} from "../../redux/feature/productionLine/productionLineSlice.js";
import {
    useCreateCategoryMutation, useDeleteCategoryMutation,
    useGetCategoryQuery,
    useUpdateCategoryMutation
} from "../../redux/feature/category/categoryApiSlice.js";
import {
    setAlertCategory, setCategoryDataForUpdate,
    setCloseDialogAddOrEditCateAndSubCate, setDeleteCategory,
    setFilterCategory,
    setIsOpenDeleteCategoryDialog, setIsOpenDialogAddOrEditCategory, setIsOpenDialogAddOrEditSubCategory,
    setIsOpenSnackbarCategory
} from "../../redux/feature/category/categorySlice.js";
import {
    useCreateSubCategoryMutation,
    useDeleteSubCategoryMutation
} from "../../redux/feature/category/subCategoryApiSlice.js";

function CategoryList(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const deleteCategoryData = useSelector((state) => state.category.deleteCategoryData);
    const categoryDataForUpdate = useSelector((state) => state.category.categoryDataForUpdate);
    const isOpen = useSelector((state) => state.category.isOpenDialogAddOrEditCategory);
    const isOpenSubCategory = useSelector((state) => state.category.isOpenDialogAddOrEditSubCategory);
    const isOpenSnackbar = useSelector((state) => state.category.isOpenSnackbarCategory);
    const alertCategory = useSelector((state) => state.category.alertCategory);
    const isOpenDeleteDialog = useSelector((state) => state.category.isOpenDeleteCategoryDialog);
    const[createCate, {isLoading: isLoadingCreateCate}] = useCreateCategoryMutation();
    const [createSubCate, {isLoading: isLoadingCreateSubCate}] = useCreateSubCategoryMutation();
    const [updateCate, {isLoading: isLoadingUpdateCate}] = useUpdateCategoryMutation();
    const [deleteCategory, {isLoading: isLoadingDeleteCategory}] = useDeleteCategoryMutation();
    const [deleteSubCategory, {isLoading: isLoadingDeleteSubCategory}] = useDeleteSubCategoryMutation();
    const filterValue = useSelector((state) => state.category.filter);
    const debounceSearch = useDebounce(filterValue.search, 500);

    const {data: cateData, isLoading, isSuccess, isFetching} = useGetCategoryQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch,
    });
    const {data: cateDataForSelect} = useGetCategoryQuery({
        pageNo: 1,
        pageSize: 999,
    });

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterCategory({
            ...filterValue,
            pageNo: newPage + 1,
        }))
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterCategory({
            ...filterValue,
            pageNo: 1,
            pageSize: event.target.value,
        }));
    };

    const handleClose = () => {
        dispatch(setCloseDialogAddOrEditCateAndSubCate(false));
        dispatch(setProductionLineDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("validation.required")),
    });

    const validationSchemaSubCate = Yup.object().shape({
        name: Yup.string().required(t("validation.required")),
        category: Yup.number().required(t("validation.required")),
    })

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (isOpenSubCategory && !categoryDataForUpdate) {
                await createSubCate({
                    name: values.name,
                    categoryId: values.category
                }).unwrap();
                dispatch(setAlertCategory({type: "success", message: "Create successfully"}));
                dispatch(setIsOpenDialogAddOrEditSubCategory(false));
            }
            if (categoryDataForUpdate) {
                await updateCate({
                    id: categoryDataForUpdate.id,
                    name: values.name,
                }).unwrap();
                dispatch(setAlertCategory({type: "success", message: "Update successfully"}));
                dispatch(setCategoryDataForUpdate(null));
            }
            if (isOpen && !isOpenSubCategory && !categoryDataForUpdate) {
                await createCate({
                    name: values.name
                }).unwrap();
                dispatch(setAlertCategory({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarCategory(true));
            dispatch(setCloseDialogAddOrEditCateAndSubCate(false));
            resetForm();
        } catch (error) {
            console.log(error?.data?.error?.description);
            dispatch(setAlertCategory({type: "error", message: error?.data?.error?.description}));
            dispatch(setIsOpenSnackbarCategory(true));
        }
    };

    const fields = [
        { name: "name",     label: "product.productCategory",     type: "text" },
    ];

    const fieldsSubCategory = [
        { name: "name",     label: "table.subCategory",     type: "text" },
        {
            name: "category",
            label: "Parent Category",
            type: "autocomplete",
            minWidth: 130,
            fetchOptions: async () => {
                return Object.values(cateDataForSelect?.entities ?? {}).map((cate) => ({
                    value: cate.id,
                    label: cate.name,
                }));
            },
        }
    ]

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterCategory({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterCategory(newFilter));
    }

    const initialValues ={
        name: ""
    }

    const initialValuesSubCategory ={
        name: "",
        category: null,
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditCategory(true));
        dispatch(setCategoryDataForUpdate({
            id: row.id,
            name: row.name,
        }));
    };

    const handleDeleteOpen = (row) => {
        if (row.subCategories && row.subCategories.length > 0) {
            dispatch(setAlertCategory({
                type: "error",
                message: `Cannot delete "${row.name}" — remove its ${row.subCategories.length} sub-categories first.`
            }));
            dispatch(setIsOpenSnackbarCategory(true));
            return;
        }
        dispatch(setDeleteCategory({ id: row.id, type: "category", name: row.name }));
        dispatch(setIsOpenDeleteCategoryDialog(true));
    };

    const handleDeleteSubOpen = (row) => {
        dispatch(setDeleteCategory({ id: row.id, type: "subCategory", name: row.name }));
        dispatch(setIsOpenDeleteCategoryDialog(true));
    };


    const handleDelete = async () => {
        try {
            if (deleteCategoryData.type === "subCategory") {
                console.log("This is SubCategory")
                await deleteSubCategory({ id: deleteCategoryData.id }).unwrap();
            } else {
                console.log("This is Category")
                await deleteCategory({ id: deleteCategoryData.id }).unwrap();
            }

            dispatch(setIsOpenDeleteCategoryDialog(false));
            dispatch(setAlertCategory({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarCategory(true));
        }catch (error) {
            dispatch(setIsOpenDeleteCategoryDialog(false));
            dispatch(setAlertCategory({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarCategory(true));
        }
    }


    const columns = [
        {
            id: "id",
            label: t("table.id"),
            minWidth: 50,
            align: "left",
        },
        {
            id: "name",
            label: t("product.productCategory"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "items",
            label: t("table.items"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "action",
            label: t("table.action"),
            minWidth: 50,
            align: "left",
        },
    ]
    const collapseColumns = [
        { id: "id",       label: t("table.id"),       align: "left" },
        { id: "name",     label: t("table.subCategory"),      align: "left" },
        { id: "category",     label: t("category"),      align: "left" },
        { id: "items",  label: t("table.items"),           align: "left" },
        { id: "action", label: t("table.action"), align: "left"}
    ];

    let content;

    if (isLoading) content = (<LoadingComponent/>);

    if (isSuccess) content = (
        <div className="pb-10">
            <div className={`
                    relative z-10 gap-2
                    px-5 py-2.5 m-2
                    rounded-xl overflow-hidden
                    border border-white/25
                    bg-white/10
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.25)]
                    backdrop-blur-md
                    transition-all duration-200 ease-out
                `}>
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <div className="flex gap-2">
                        <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditSubCategory(true))} title={"buttons.addNewSubCategory"}/>
                        <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditCategory(true))} title={"buttons.addNewCategory"}/>
                    </div>
                </div>
                <TableCus
                    columns={columns}
                    data={cateData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    onDeleteSub={handleDeleteSubOpen}
                    isFilterActive={true}
                    searchPlaceholderText={`${t("product.productCategory")}`}
                    filterValue={filterValue}
                    handleFilterChange={handleFilterChange}
                    isFetching={isFetching}
                    collapseColumns={collapseColumns}
                    collapseDataKey="subCategories"
                />
            </div>
            <DialogAddEditCus
                fields={isOpenSubCategory ? fieldsSubCategory : fields}
                title={categoryDataForUpdate ? "Update ProductionLine" : "Create ProductionLine"}
                isOpen={isOpenSubCategory || isOpen}
                onClose={handleClose}
                isUpdate={!!categoryDataForUpdate}
                validationSchema={isOpenSubCategory ? validationSchemaSubCate : validationSchema}
                handleSubmit={handleSubmit}
                isSubmitting={isLoadingCreateCate || isLoadingUpdateCate || isLoadingCreateSubCate}
                initialValues={categoryDataForUpdate ? categoryDataForUpdate : isOpenSubCategory ? initialValuesSubCategory : initialValues}/>
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarCategory(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarCategory(false))}
                    severity={alertCategory.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertCategory.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete
                isOpen={isOpenDeleteDialog}
                onClose={() => dispatch(setIsOpenDeleteCategoryDialog(false))}
                handleDelete={handleDelete}
                isSubmitting={isLoadingDeleteCategory || isLoadingDeleteSubCategory}
            />
        </div>
    )

    return content;
}

export default CategoryList;