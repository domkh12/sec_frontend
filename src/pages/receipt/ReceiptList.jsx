import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import { setAlertReceipt, setFilterReceipt, setIsOpenDeleteReceiptDialog, setIsOpenDialogAddOrEditReceipt, setIsOpenSnackbarReceipt, setReceiptDataForUpdate } from "../../redux/feature/receipt/receiptSlice";
import TableCus from "../../components/table/TableCus";
import Seo from "../../components/seo/Seo";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { useGetPurchaseOrderLookupQuery } from "../../redux/feature/purchaseOrder/purchaseOrderApiSlice";
import { useGetSupplierLookupQuery } from "../../redux/feature/supplier/supplierApiSlice";
import { useCreateReceiptMutation, useDeleteReceiptMutation, useGetReceiptQuery, useUpdateReceiptMutation } from "../../redux/feature/receipt/receiptApiSlice";
import { Alert, Snackbar } from "@mui/material";
import useDebounce from "../../hook/useDebounce";
import LoadingComponent from "../../components/ui/LoadingComponent";
import dayjs from "dayjs";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete";
import { useState } from "react";

function ReceiptList() {

    // -- State -------------------------------------------------------------
    const [uuid, setUuid] = useState(null);

    // -- Selector ---------------------------------------------------------
    const isOpen                    = useSelector(state => state.receipt.isOpenDialogAddOrEditReceipt);
    const receiptDataForUpdate      = useSelector(state => state.receipt.receiptDataForUpdate);
    const isOpenSnackbarReceipt     = useSelector(state => state.receipt.isOpenSnackbarReceipt);
    const alertReceipt              = useSelector(state => state.receipt.alertReceipt);
    const filterValue               = useSelector(state => state.receipt.filter);
    const isOpenDeleteDialog        = useSelector(state => state.receipt.isOpenDeleteReceiptDialog);

    // -- Hook ---------------------------------------------------------
    const navigate  = useNavigate();
    const dispatch  = useDispatch();
    const {t}       = useTranslation();
    const search    = useDebounce(filterValue.search, 500);

    // -- Query ------------------------------------------------------------
    const {data: receiptData,    isLoading: isLoadingReceipt, isSuccess: receiptSuccess} = useGetReceiptQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: search
    });
    const {data: poData,        isLoading: isLoadingPO, isSuccess: poSuccess} = useGetPurchaseOrderLookupQuery();
    const {data: supplierData,  isLoading: isLoadingSupplier, isSuccess: supplierSuccess} = useGetSupplierLookupQuery();

    // -- Mutation ----------------------------------------------------------
    const [createReceipt, {isLoading: isLoadingCreateReceipt}] = useCreateReceiptMutation();
    const [updateReceipt, {isLoading: isLoadingUpdateReceipt}] = useUpdateReceiptMutation();
    const [deleteReceipt, {isLoading: isLoadingDeleteReceipt}] = useDeleteReceiptMutation();
    
    // -- Function ---------------------------------------------------------
    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditReceipt(false));
        dispatch(setReceiptDataForUpdate(null));
    }

    const handleSubmit = async (values) => {
        try{
            if (receiptDataForUpdate) {
                await updateReceipt({uuid: receiptDataForUpdate.uuid, 
                    receiptNo: values.receiptNo,
                    receiptDate: values.date,
                    poUuid: values.po,
                    totalQty: values.totalQty,
                    supplierUuid: values.supplier,
                    remark: values.remark
                }).unwrap();
                dispatch(setAlertReceipt({type: "success", message: "Update successfully"}));
                dispatch(setIsOpenSnackbarReceipt(true));
                handleClose();
            }else{
                await createReceipt({
                    receiptNo: values.receiptNo,
                    receiptDate: values.date,
                    poUuid: values.po,
                    totalQty: values.totalQty,
                    supplierUuid: values.supplier,
                    remark: values.remark
                }).unwrap();
                dispatch(setAlertReceipt({type: "success", message: "Create successfully"}));
                dispatch(setIsOpenSnackbarReceipt(true));
                handleClose();
            }
        }catch(error){
            console.log(error);
            dispatch(setAlertReceipt({type: "error", message: error.data?.error?.description || "Failed to create receipt"}));
            dispatch(setIsOpenSnackbarReceipt(true));
        }
    }

    const handleDelete = async () => {
        try {
            await deleteReceipt({uuid: uuid}).unwrap();
            dispatch(setIsOpenDeleteReceiptDialog(false));
            dispatch(setAlertReceipt({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarReceipt(true));
        } catch (error) {
            dispatch(setIsOpenDeleteReceiptDialog(false));
            dispatch(setAlertReceipt({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarReceipt(true));
        }
    }

    const handleDeleteOpen = (row) => {
        setUuid(row.uuid);
        dispatch(setIsOpenDeleteReceiptDialog(true));
    }

    const handleEdit = (row) => {
        dispatch(setReceiptDataForUpdate({
            uuid: row?.uuid,
            receiptNo: row?.receiptNo,
            date: dayjs(row?.receiptDate),
            po: row?.purchaseOrder?.uuid,
            totalQty: row.totalQty,
            supplier: row?.supplier?.uuid,
            remark: row?.remark
        }));
        dispatch(setIsOpenDialogAddOrEditReceipt(true));
    }

     const handleChangePage = (event, newPage) => {
        dispatch(setFilterReceipt({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };
    
    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterReceipt({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const columns = [
        {
            id: "receiptNo",
            label: t("receiptNumber"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "receiptDate",
            label: t("receiptDate"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "purchaseOrder",
            label: t("po"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.po
        },
        {
            id: "totalQty",
            label: t("totalQty"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "supplier",
            label: t("supplier"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.supplierName
        },
        {
            id: "remark",
            label: t("remark"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "action",
            label: t("action"),
            minWidth: 130,
            align: "center",
        }
      
    ];

    const fields = [
        { name: "receiptNo",     label: "receiptNumber",     type: "text" },
        { name: "date",     label: "receiptDate",     type: "date" },
        {   name: "po",     
            label: "po",     
            type: "autocomplete",
            options: poData?.map((item) => ({
                label: item.po,
                value: item.uuid
            })),
        },
        { name: "totalQty",     label: "totalQty",     type: "number" },
        {   name: "supplier",     
            label: "supplier",     
            type: "autocomplete",
            options: supplierData?.map((item) => ({
                label: item.supplierName,
                value: item.uuid
            })) 
        },
        { name: "remark",     label: "remark",     type: "textarea" },
        
    ];

    const initialValues = {
        receiptNo: "",
        date: null,
        po: "",
        totalQty: "",
        supplier: "",
        remark: ""
    }

    let content;

    if (isLoadingReceipt) content = <LoadingComponent/>;

    if(receiptSuccess) content = (
    <div className="pb-10">
            <Seo title="Receipt List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditReceipt(true))}/>
                </div>
                <TableCus
                    columns={columns}
                    data={receiptData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    // onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    // isFilterActive={true}
                    // filterValue={filterValue}
                    // handleFilterChange={handleFilterChange}
                    // searchPlaceholderText={`${t('Code/Name/Address/City')}`}
                    // onClearAllFilters={handleClearAllFilters}
                    // onToggleActive={(entity) => handleToggleActive(entity)}
                    // tToggleActive="Toggle status"
                />
            </div>

            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={receiptDataForUpdate ? "Update Rack" : "Create Rack"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!receiptDataForUpdate}
                        // validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={receiptDataForUpdate ? receiptDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateReceipt || isLoadingUpdateReceipt}
                    />
                )
            }

            <Snackbar
                open={isOpenSnackbarReceipt}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarReceipt(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarReceipt(false))}
                    severity={alertReceipt.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertReceipt.message}
                </Alert>
            </Snackbar>

            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteReceiptDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteReceipt}/>
        </div>
    )

    return content;
    
}

export default ReceiptList;