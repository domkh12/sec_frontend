import { useNavigate } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import BackButton from "../../components/ui/BackButton";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import TableCus from "../../components/table/TableCus";
import { useCreateSupplierMutation, useDeleteSupplierMutation, useGetSupplierQuery, useUpdateSupplierMutation } from "../../redux/feature/supplier/supplierApiSlice";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { setAlertSupplier, setFilterSupplier, setIsOpenDeleteSupplierDialog, setIsOpenDialogAddOrEditSupplier, setIsOpenSnackbarSupplier, setSupplierDataForUpdate } from "../../redux/feature/supplier/supplierSlice";
import useDebounce from "../../hook/useDebounce";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete";
import LoadingComponent from "../../components/ui/LoadingComponent";

function SupplierList() {

    // -- State ------------------------------------------------------------------
    const [uuid, setUuid] = useState(null);

    // -- Selector ---------------------------------------------------------------
    const isOpen                    = useSelector(state => state.supplier.isOpenDialogAddOrEditSupplier);
    const supplierDataForUpdate     = useSelector(state => state.supplier.supplierDataForUpdate); 
    const filterValue               = useSelector(state => state.supplier.filter);
    const isOpenSnackbarSupplier    = useSelector(state => state.supplier.isOpenSnackbarSupplier);
    const alertSupplier             = useSelector(state => state.supplier.alertSupplier);
    const isOpenDeleteDialog        = useSelector(state => state.supplier.isOpenDeleteSupplierDialog);

    // -- Hook ---------------------------------------------------------------
    const navigate  = useNavigate();
    const dispatch  = useDispatch();
    const {t}       = useTranslation();
    const search    = useDebounce(filterValue.search, 500);

    // -- Query ---------------------------------------------------------------
    const {data: supplierData, isLoading, isSuccess} = useGetSupplierQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: search
    });

    // -- Mutation ---------------------------------------------------------------
    const [createSupplier, {isLoading: isLoadingCreateSupplier}] = useCreateSupplierMutation();
    const [updateSupplier, {isLoading: isLoadingUpdateSupplier}] = useUpdateSupplierMutation();
    const [deleteSupplier, {isLoading: isLoadingDeleteSupplier}] = useDeleteSupplierMutation();

    // -- Function ---------------------------------------------------------------
    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditSupplier(false));
        dispatch(setSupplierDataForUpdate(null));
    }

    const handleEdit = (row) => {
        dispatch(setSupplierDataForUpdate(row));
        dispatch(setIsOpenDialogAddOrEditSupplier(true));
    }

    const handleSubmit = async (values) => {
        try {
            if(supplierDataForUpdate) {
                await updateSupplier({uuid: supplierDataForUpdate.uuid, ...values}).unwrap();
                dispatch(setSupplierDataForUpdate(null));
                dispatch(setIsOpenDialogAddOrEditSupplier(false));
                dispatch(setAlertSupplier({type: "success", message: "Update successfully"}));
                dispatch(setIsOpenSnackbarSupplier(true));
            }else{
                await createSupplier(values).unwrap();
                dispatch(setIsOpenDialogAddOrEditSupplier(false));
                dispatch(setSupplierDataForUpdate(null));
                dispatch(setAlertSupplier({type: "success", message: "Create successfully"}));
                dispatch(setIsOpenSnackbarSupplier(true));
            }
        } catch (error) {
            console.error("Failed to create supplier: ", error);
            dispatch(setAlertSupplier({type: "error", message: error.data?.error?.description || "Failed to create supplier"}));
            dispatch(setIsOpenSnackbarSupplier(true));
        }
    }

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterSupplier({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };
    
    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterSupplier({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleDeleteOpen = (row) => {
        setUuid(row.uuid);
        dispatch(setIsOpenDeleteSupplierDialog(true));
    }

    const handleDelete = async () => {
        try {
            await deleteSupplier({uuid: uuid}).unwrap();
            dispatch(setIsOpenDeleteSupplierDialog(false));
            dispatch(setAlertSupplier({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarSupplier(true));
        } catch (error) {
            dispatch(setIsOpenDeleteSupplierDialog(false));
            dispatch(setAlertSupplier({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarSupplier(true));
        }
    }

    const handleFilterChange = (key, value) => {
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterSupplier(newFilter));
    }

    const columns = [
        {
            id: "supplierName",
            label: t("supplierName"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "contactPerson",
            label: t("contactPerson"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "email",
            label: t("email"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "phone",
            label: t("phoneNumber"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "address",
            label: t("address"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "action",
            label: t("action"),
            minWidth: 130,
            align: "center",
        }
      
    ]

    const fields = [
        { name: "supplierName",     label: "supplierName",     type: "text" },
        { name: "contactPerson",     label: "contactPerson",     type: "text" },
        { name: "email",     label: "email",     type: "text" },
        { name: "phone",     label: "phone",     type: "text" },
        { name: "address",     label: "address",     type: "text" },
    ];

    const initialValues = {
        supplierName: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
    };

    let content;

    if(isLoading) content = <LoadingComponent/>;

    if(isSuccess) content = (
<div className="pb-10">
        <Seo title="Supplier List"/>
        <div className="card-glass">
            <div className="flex justify-between items-center">
                <BackButton onClick={() => navigate("/admin")}/>
                <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditSupplier(true))}/>
            </div>
             <TableCus
                columns={columns}
                data={supplierData}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                onEdit={handleEdit}
                onDelete={handleDeleteOpen}
                isFilterActive={true}
                filterValue={filterValue}
                handleFilterChange={handleFilterChange}
                searchPlaceholderText={`${t('supplierName')} / ${t('contactPerson')} / ${t('email')} / ${t('phone')} / ${t('address')}`}
            />
         </div>
         {
            isOpen && (
                <DialogAddEditCus
                    fields={fields}
                    title={supplierDataForUpdate ? "Update Unit" : "Create Unit"}
                    isOpen={isOpen}
                    onClose={handleClose}
                    isUpdate={!!supplierDataForUpdate}
                    // validationSchema={validationSchema}
                    handleSubmit={handleSubmit}
                    initialValues={supplierDataForUpdate ? supplierDataForUpdate : initialValues}
                    isSubmitting={isLoadingCreateSupplier || isLoadingUpdateSupplier}
                />
            )
        }

        <Snackbar
            open={isOpenSnackbarSupplier}
            autoHideDuration={6000}
            onClose={() => dispatch(setIsOpenSnackbarSupplier(false))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={() => dispatch(setIsOpenSnackbarSupplier(false))}
                severity={alertSupplier.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertSupplier.message}
            </Alert>
        </Snackbar>
        
        <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteSupplierDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteSupplier}/>
    </div>
    );

    return content;
}

export default SupplierList;