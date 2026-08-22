import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";
import TableCus from "../../components/table/TableCus";
import { useTranslation } from "react-i18next";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import { useCreateWarehouseMutation, useDeleteWarehouseMutation, useGetWarehouseQuery, useUpdateWarehouseMutation } from "../../redux/feature/warehouse/warehouseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { setAlertWarehouse, setFilterWarehouse, setIsOpenDeleteWarehouseDialog, setIsOpenDialogAddOrEditWarehouse, setIsOpenSnackbarWarehouse, setWarehouseDataForUpdate } from "../../redux/feature/warehouse/warehouseSlice";
import { Alert, Snackbar } from "@mui/material";
import useDebounce from "../../hook/useDebounce";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete";
import { useState } from "react";
import Seo from "../../components/seo/Seo";
import LoadingComponent from "../../components/ui/LoadingComponent";

function WarehouseList() {
    // -- State -------------------------------------------------------------------
    const [uuid, setUuid] = useState(null);

    // -- Selector ----------------------------------------------------------------
    const isOpen                   = useSelector((s) => s.warehouse.isOpenDialogAddOrEditWarehouse);
    const warehouseDataForUpdate   = useSelector((s) => s.warehouse.warehouseDataForUpdate);
    const isOpenSnackbarWarehouse  = useSelector((s) => s.warehouse.isOpenSnackbarWarehouse);
    const alertWarehouse           = useSelector((s) => s.warehouse.alertWarehouse);
    const filterValue              = useSelector((s) => s.warehouse.filter);
    const isOpenDeleteDialog       = useSelector((s) => s.warehouse.isOpenDeleteWarehouseDialog);

    // -- Hook --------------------------------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const search = useDebounce(filterValue.search, 500);

    // -- Query ----------------------------------------------------------------
    const {data: warehouseData, isLoading: isLoadingWarehouseData, isSuccess: isSuccessWarehouseData} = useGetWarehouseQuery({
        refetchOnMountOrArgChange: true,
        ...filterValue,
    });
    
    // -- Mutation ----------------------------------------------------------------
    const [createWarehouse, {isLoading: isLoadingCreateWarehouse}] = useCreateWarehouseMutation();
    const [updateWarehouse, {isLoading: isLoadingUpdateWarehouse}] = useUpdateWarehouseMutation();
    const [deleteWarehouse, {isLoading: isLoadingDeleteWarehouse}] = useDeleteWarehouseMutation();

    // -- Function ----------------------------------------------------------------

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditWarehouse(false));
        dispatch(setWarehouseDataForUpdate(null));
    }

    const handleSubmit = async (values) => {

        try {
            if (warehouseDataForUpdate) {
                await updateWarehouse({uuid: warehouseDataForUpdate.uuid, ...values}).unwrap();
                dispatch(setAlertWarehouse({type: "success", message: "Update successfully"}));
                dispatch(setIsOpenSnackbarWarehouse(true));
                handleClose();
            }else{
                await createWarehouse(values).unwrap();
                dispatch(setAlertWarehouse({type: "success", message: "Create successfully"}));
                dispatch(setIsOpenSnackbarWarehouse(true));
                handleClose();
            }
        } catch (err) {
            console.error("Failed to create warehouse: ", err);
            dispatch(setAlertWarehouse({type: "error", message: err.data?.error?.description || "Failed to create warehouse"}));
            dispatch(setIsOpenSnackbarWarehouse(true));

        }
    }

    const handleEdit = (warehouse) => {
        console.log("handleEdit", warehouse);
        dispatch(setIsOpenDialogAddOrEditWarehouse(true));
        dispatch(setWarehouseDataForUpdate(warehouse));
    }

    const handleDeleteOpen = (warehouse) => {
        setUuid(warehouse.uuid);
        console.log("warehouse.uuid", warehouse.uuid);
        dispatch(setIsOpenDeleteWarehouseDialog(true));
    }

    const handleDelete = async () => {
        try {
            await deleteWarehouse({uuid: uuid}).unwrap();
            dispatch(setIsOpenDeleteWarehouseDialog(false));
            dispatch(setAlertWarehouse({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarWarehouse(true));
        } catch (error) {
            dispatch(setIsOpenDeleteWarehouseDialog(false));
            dispatch(setAlertWarehouse({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarWarehouse(true));
        }
    }

    const handleChangePage = (event, newPage) => {
            dispatch(setFilterWarehouse({
                ...filterValue,
                pageNo: newPage + 1,
            }));
        };
    
    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterWarehouse({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };


    const handleFilterChange = (key, value) => {
        const newFilter = {
                ...filterValue,
                [key]: value,
            }
        dispatch(setFilterWarehouse(newFilter));
    }

    const columns = [
        {
            id: "code",
            label: t("code"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "name",
            label: t("name"),
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
            id: "city",
            label: t("city"),
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
        { name: "code",     label: "code",     type: "text" },
        { name: "name",     label: "name",     type: "text" },
        { name: "address",  label: "address",  type: "text" },
        { name: "city",     label: "city",     type: "text" },
        
    ];

    const initialValues = {
        code: "",
        name: "",
        address: "",
        city: "",
    };

    let content;

    if (isLoadingWarehouseData) content = <LoadingComponent/>;

    if (isSuccessWarehouseData) content = (
        <div className="pb-10">
            <Seo title="Warehouse List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditWarehouse(true))}/>
                </div>
                <TableCus
                    columns={columns}
                    data={warehouseData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    // onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('Code/Name/Address/City')}`}
                    // onClearAllFilters={handleClearAllFilters}
                    // onToggleActive={(entity) => handleToggleActive(entity)}
                    // tToggleActive="Toggle status"
                />
            </div>

            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={warehouseDataForUpdate ? "Update Warehouse" : "Create Warehouse"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!warehouseDataForUpdate}
                        // validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={warehouseDataForUpdate ? warehouseDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateWarehouse || isLoadingUpdateWarehouse}
                    />
                )
            }

            <Snackbar
                open={isOpenSnackbarWarehouse}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarWarehouse(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarWarehouse(false))}
                    severity={alertWarehouse.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertWarehouse.message}
                </Alert>
            </Snackbar>

            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteWarehouseDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteWarehouse}/>
            
        </div>
    );


    return content;

}

export default WarehouseList;