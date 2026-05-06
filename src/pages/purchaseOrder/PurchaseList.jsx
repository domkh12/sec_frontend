import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as Yup from "yup";
import {Alert, Backdrop, Snackbar} from "@mui/material";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {
    useCreatePurchaseOrderMutation, useDeletePurchaseOrderMutation, useGetPurchaseOrderQuery,
    useUpdatePurchaseOrderMutation
} from "../../redux/feature/purchaseOrder/purchaseOrderApiSlice.js";
import {
    setAlertPurchaseOrder,
    setFilterPurchaseOrder, setIsOpenDeletePurchaseOrderDialog,
    setIsOpenDialogAddOrEditPurchaseOrder, setIsOpenSnackbarPurchaseOrder, setPurchaseOrderDataForUpdate
} from "../../redux/feature/purchaseOrder/purchaseOrderSlice.js";
import {useGetStyleLookupQuery} from "../../redux/feature/style/styleApiSlice.js";

function PurchaseList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // -- Selector --------------------------------------------------------------------------------------------

    const purchaseOrderDataForUpdate     = useSelector((s) => s.purchaseOrder.purchaseOrderDataForUpdate);
    const isOpen                   = useSelector((s) => s.purchaseOrder.isOpenDialogAddOrEditPurchaseOrder);
    const isOpenSnackbar           = useSelector((s) => s.purchaseOrder.isOpenSnackbarPurchaseOrder);
    const alertPurchaseOrder             = useSelector((s) => s.purchaseOrder.alertPurchaseOrder);
    const isOpenDeleteDialog       = useSelector((s) => s.purchaseOrder.isOpenDeletePurchaseOrderDialog);
    const filterValue              = useSelector((s) => s.purchaseOrder.filter);

    // -- Mutation -----------------------------------------------------------
    const [createPurchaseOrder]   = useCreatePurchaseOrderMutation();
    const [updatePurchaseOrder]   = useUpdatePurchaseOrderMutation();
    const [deletePurchaseOrder]   = useDeletePurchaseOrderMutation();

    // -- Query ---------------------------------------------------------------
    const {data: prodData,
        isLoading,
        isSuccess
    }                               = useGetPurchaseOrderQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
    });
    const {data: styleLookup}      = useGetStyleLookupQuery();
    console.log(styleLookup)

    // -- Handler ----------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterPurchaseOrder({
            ...filterValue,
            pageNo: newPage + 1,
        }))
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterPurchaseOrder({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditPurchaseOrder(false));
        dispatch(setPurchaseOrderDataForUpdate(null));
    }

    const handleSubmit = async (values, {resetForm}) => {
        setIsSubmitting(true);
        try {
            if (purchaseOrderDataForUpdate) {

                await updatePurchaseOrder({
                    id: purchaseOrderDataForUpdate.id,
                    styleNo: values.styleNo,
                    subCategoryId:  values.subCategory.childId,
                    color:     values.color,
                    size:      values.size,
                }).unwrap();
                dispatch(setAlertPurchaseOrder({type: "success", message: "Update successfully"}));
                dispatch(setPurchaseOrderDataForUpdate(null));
            }else {
                await createPurchaseOrder({
                    styleNo: values.styleNo,
                    subCategoryId:  values.subCategory.childId,
                    colorId:     values.color,
                    sizeId:      values.size,
                }).unwrap();
                dispatch(setAlertPurchaseOrder({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
            dispatch(setIsOpenDialogAddOrEditPurchaseOrder(false));
            resetForm();
        } catch (error) {
            console.log(error);
            dispatch(setAlertPurchaseOrder({type: "error", message: error?.data?.error?.description}));
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
        }finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditPurchaseOrder(true));
        dispatch(setPurchaseOrderDataForUpdate({
            id: row.id,
            styleNo: row.styleNo,
            subCategoryId: row.subCategoryId,
            color: row.color,
            size: row.size,
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeletePurchaseOrderDialog(true));
        setId(row.id);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePurchaseOrder({ id }).unwrap();
            dispatch(setIsOpenDeletePurchaseOrderDialog(false));
            dispatch(setAlertPurchaseOrder({ type: "success", message: "Delete successfully" }));
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
        } catch (error) {
            dispatch(setIsOpenDeletePurchaseOrderDialog(false));
            dispatch(setAlertPurchaseOrder({ type: "error", message: error.data.error.description }));
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
        } finally {
            setIsDeleting(false);
        }
    };

    // -- Validation Schema ----------------------------------------------------------------------------------
    const validationSchema = Yup.object().shape({
        po:      Yup.string().required(t("validation.required")),
    });

    const fields = [
        { name: "po",     label: "po",     type: "text" },
        { name: "qty",     label: "Total Order Qty",     type: "number" },
        { name: "shipmentDate",     label: "Shipment Date",     type: "date" },
    ];

    const initialValues = {
        po: "",
        qty: 0,
        shipmentDate: null
    };

    const columns = [
        {
            id: "po",
            label: t("po"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "status",
            label: t("table.status"),
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
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditPurchaseOrder(true))}/>
                </div>
                <TableCus columns={columns} data={prodData} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} onEdit={handleEdit} onDelete={handleDeleteOpen}/>
            </div>

            <DialogAddEditCus
                fields={fields}
                title={purchaseOrderDataForUpdate ? "Update PurchaseOrder" : "Create PurchaseOrder"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={!!purchaseOrderDataForUpdate}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                initialValues={purchaseOrderDataForUpdate ? purchaseOrderDataForUpdate : initialValues}
                isSubmitting={isSubmitting}
            />

            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarPurchaseOrder(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarPurchaseOrder(false))}
                    severity={alertPurchaseOrder.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertPurchaseOrder.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeletePurchaseOrderDialog(false))} handleDelete={handleDelete} isSubmitting={isDeleting}/>
        </div>
    )

    return content;
}

export default PurchaseList;