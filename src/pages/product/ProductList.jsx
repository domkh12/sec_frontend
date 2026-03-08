import {Alert, Backdrop, Snackbar} from "@mui/material";
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
import { useCreateProductionLineMutation, useDeleteProductionLineMutation, useUpdateProductionLineMutation } from "../../redux/feature/productionLine/productionLineApiSlice.js";
import { setAlertDept, setIsOpenDeleteDeptDialog, setIsOpenDialogAddOrEditProductionLine, setIsOpenSnackbarProductionLine, setPageNoProductionLine, setPageSizeProductionLine, setProductionLineDataForUpdate } from "../../redux/feature/productionLine/productionLineSlice.js";
import { useGetDepartmentQuery } from "../../redux/feature/department/departmentApiSlice.js";
import {useGetProductQuery} from "../../redux/feature/product/productApiSlice.js";
import {
    setIsOpenDeleteProductDialog,
    setIsOpenDialogAddOrEditProduct,
    setIsOpenSnackbarProduct, setProductDataForUpdate
} from "../../redux/feature/product/productSlice.js";


function ProductList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const pageNo = useSelector((state) => state.product.pageNo);
    const pageSize = useSelector((state) => state.product.pageSize);
    const productDataForUpdate = useSelector((state) => state.product.productDataForUpdate);
    const isOpen = useSelector((state) => state.product.isOpenDialogAddOrEditProduct);
    const isOpenSnackbar = useSelector((state) => state.product.isOpenSnackbarProduct);
    const alertProduct = useSelector((state) => state.product.alertProduct);
    const isOpenDeleteDialog = useSelector((state) => state.product.isOpenDeleteProductDialog);
    const[createDept] = useCreateProductionLineMutation();
    const [updateDept] = useUpdateProductionLineMutation();
    const [deleteDept] = useDeleteProductionLineMutation();
    const {data: prodData, isLoading, isSuccess} = useGetProductQuery({
        pageNo: pageNo,
        pageSize: pageSize
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
        dispatch(setIsOpenDialogAddOrEditProduct(false));
        dispatch(setProductDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        line: Yup.string().required(t("validation.required")),
        deptId: Yup.number().required(t("validation.required")),
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (productDataForUpdate) {
                 await updateDept({
                    id: productDataForUpdate.id,
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
        { name: "code",     label: "code",     type: "text" },
        { name: "styleName",     label: "styleName",     type: "text" },
        { name: "category",     label: "category",     type: "text" },
        { name: "color",     label: "color",     type: "text" },
        { name: "size", label: "size", type: "text" },
    ];

    const initialValues ={
        line: "",
        deptId: "",
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditProductionLine(true));
        dispatch(setProductDataForUpdate({
        id: row.id,
        line: row.line,
        deptId: row.deptId,
    }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteProductDialog(true));
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
            id: "code",
            label: t("code"),
            minWidth: 50,
            align: "left",
        },
        {
            id: "name",
            label: t("styleName"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "category",
            label: t("category"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "buyer",
            label: t("buyer"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "smv",
            label: t("smv"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "color",
            label: t("color"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "status",
            label: "status",
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

    let content;

    if (isLoading) content = <Backdrop open={isLoading}/>;

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
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditProduct(true))}/>
                </div>
                <TableCus columns={columns} data={prodData} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} onEdit={handleEdit} onDelete={handleDeleteOpen}/>
            </div>
            <DialogAddEditCus
                fields={fields}
                title={productDataForUpdate ? "Update Product" : "Create Product"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={!!productDataForUpdate}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                initialValues={productDataForUpdate ? productDataForUpdate : initialValues}/>
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarProduct(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarProduct(false))}
                    severity={alertProduct.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertProduct.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteProductDialog(false))} handleDelete={handleDelete}/>
        </div>
    )

    return content;
}

export default ProductList