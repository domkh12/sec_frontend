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
import {useState} from "react";
import { useCreateProductionLineMutation, useDeleteProductionLineMutation, useGetProductionLineQuery, useUpdateProductionLineMutation } from "../../redux/feature/productionLine/productionLineApiSlice.js";
import { useGetDepartmentQuery } from "../../redux/feature/department/departmentApiSlice.js";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import useDebounce from "../../hook/useDebounce.jsx";
import {useBreakpoints} from "../../hook/useBreakpoints.jsx";
import {
    setAlertDept,
    setFilterProductionLine,
    setIsOpenDeleteDeptDialog,
    setIsOpenDialogAddOrEditProductionLine,
    setIsOpenSnackbarProductionLine,
    setPageNoProductionLine,
    setPageSizeProductionLine,
    setProductionLineDataForUpdate
} from "../../redux/feature/productionLine/productionLineSlice.js";

function CategoryList(){
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isMd} = useBreakpoints();
    const productionLineDataForUpdate = useSelector((state) => state.productionLine.productionlineDataForUpdate);
    const isOpen = useSelector((state) => state.productionLine.isOpenDialogAddOrEditProductionLine);
    const isOpenSnackbar = useSelector((state) => state.productionLine.isOpenSnackbarProductionLine);
    const alertDept = useSelector((state) => state.productionLine.alertDept);
    const isOpenDeleteDialog = useSelector((state) => state.productionLine.isOpenDeleteDeptDialog);
    const[createDept, {isLoading: isLoadingCreateDept}] = useCreateProductionLineMutation();
    const [updateDept, {isLoading: isLoadingUpdateDept}] = useUpdateProductionLineMutation();
    const [deleteDept, {isLoading: isLoadingDeleteDept}] = useDeleteProductionLineMutation();
    const filterValue = useSelector((state) => state.productionLine.filter);
    const debounceSearch = useDebounce(filterValue.search, 500);
    const {data: prodData, isLoading, isSuccess, isFetching} = useGetProductionLineQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch,
        departmentId: filterValue.department,
    });
    const {data: deptData} = useGetDepartmentQuery({
        pageNo: 1,
        pageSize: 999
    });


    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoProductionLine(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeProductionLine(event.target.value));
        dispatch(setPageNoProductionLine(1));
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditProductionLine(false));
        dispatch(setProductionLineDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        line: Yup.string().required(t("validation.required")),
        deptId: Yup.number().required(t("validation.required")),
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (productionLineDataForUpdate) {
                await updateDept({
                    id: productionLineDataForUpdate.id,
                    line: values.line,
                    deptId: values.deptId,
                }).unwrap();
                dispatch(setAlertDept({type: "success", message: "Update successfully"}));
                dispatch(setProductionLineDataForUpdate(null));
            }else {
                await createDept({
                    line: values.line,
                    deptId: values.deptId
                }).unwrap();
                dispatch(setAlertDept({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarProductionLine(true));
            dispatch(setIsOpenDialogAddOrEditProductionLine(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertDept({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarProductionLine(true));
        }
    };

    const fields = [
        { name: "line",     label: "product.line",     type: "text" },
        {
            id: "deptId",
            name: "deptId",
            label: t("department.title"),
            type: "autocomplete",
            minWidth: 130,
            fetchOptions: async () => {
                return Object.values(deptData?.entities ?? {}).map((dept) => ({
                    value: dept.id,
                    label: dept.department,
                }));
            },
        },
    ];

    const handleFilterChange = (key, value) => {
        console.log(key, value);
        if (value === "all") {
            return dispatch(setFilterProductionLine({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterProductionLine(newFilter));
    }

    const initialValues ={
        line: "",
        deptId: "",
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditProductionLine(true));
        dispatch(setProductionLineDataForUpdate({
            id: row.id,
            line: row.line,
            deptId: row.deptId,
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteDeptDialog(true));
        setId(row.id);
    };

    const handleDelete = async () => {
        console.log(id);
        try {
            await deleteDept({id: id}).unwrap();
            dispatch(setIsOpenDeleteDeptDialog(false));
            dispatch(setAlertDept({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarProductionLine(true));
        }catch (error) {
            dispatch(setIsOpenDeleteDeptDialog(false));
            dispatch(setAlertDept({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarProductionLine(true));
        }
    }

    const columns = [
        {
            id: "id",
            label: t("id"),
            minWidth: 50,
            align: "left",
        },
        {
            id: "line",
            label: t("product.line"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "dept",
            label: t("department.title"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "workers",
            label: t("table.workers"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "target",
            label: t("table.target"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "actual",
            label: t("table.actual"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "efficiency",
            label: t("table.efficiency"),
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

    const filterConfig = [
        {
            id: 'department',
            label: t("table.deptAndLine"),
            width: isMd ? 150 : "100%",
            options: [
                { value: 'all', label: t('filter.all') },
                ...(deptData?.ids?.map(id => ({
                    value: deptData.entities[id].id,
                    label: deptData.entities[id].department
                })) || [])
            ]
        }
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
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditProductionLine(true))}/>
                </div>
                <TableCus
                    columns={columns}
                    data={prodData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit} onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    searchPlaceholderText={`${t("table.productionLine")}`}
                    filterValue={filterValue}
                    handleFilterChange={handleFilterChange}
                    isFetching={isFetching}
                    filterConfig={filterConfig}
                />
            </div>
            <DialogAddEditCus
                fields={fields}
                title={productionLineDataForUpdate ? "Update ProductionLine" : "Create ProductionLine"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={!!productionLineDataForUpdate}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                isSubmitting={isLoadingCreateDept || isLoadingUpdateDept}
                initialValues={productionLineDataForUpdate ? productionLineDataForUpdate : initialValues}/>
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarProductionLine(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarProductionLine(false))}
                    severity={alertDept.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertDept.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete
                isOpen={isOpenDeleteDialog}
                onClose={() => dispatch(setIsOpenDeleteDeptDialog(false))}
                handleDelete={handleDelete}
                isSubmitting={isLoadingDeleteDept}
            />
        </div>
    )

    return content;
}

export default CategoryList;