import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton"
import { useDispatch, useSelector } from "react-redux";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import Seo from "../../components/seo/Seo";
import TableCus from "../../components/table/TableCus";
import { useTranslation } from "react-i18next";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { setAlertRack, setIsOpenDeleteRackDialog, setIsOpenDialogAddOrEditRack, setIsOpenSnackbarRack, setRackDataForUpdate } from "../../redux/feature/rack/rackSlice";
import { useGetWarehouseLookupQuery } from "../../redux/feature/warehouse/warehouseApiSlice";
import { useCreateRackMutation, useDeleteRackMutation, useGetRackQuery, useUpdateRackMutation } from "../../redux/feature/rack/rackApiSlice";
import { Alert, Snackbar } from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete";


function RackList() {

  // -- Selector ----------------------------------------------------------------
  const isOpen                   = useSelector((s) => s.rack.isOpenDialogAddOrEditRack);
  const rackDataForUpdate        = useSelector((s) => s.rack.rackDataForUpdate);
  const isOpenSnackbarRack       = useSelector((s) => s.rack.isOpenSnackbarRack);
  const alertRack                = useSelector((s) => s.rack.alertRack);
  const isOpenDeleteDialog        = useSelector((s) => s.rack.isOpenDeleteRackDialog);

  // -- Hook --------------------------------------------------------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // -- Query -------------------------------------------------------------------
  const {data: warehouseLookupData} = useGetWarehouseLookupQuery();
  const {data: rackData} = useGetRackQuery({
    refetchOnMountOrArgChange: true,
    pageNo: 1,
    pageSize: 10,
    search: "",
  });

  
  // -- Mutation ----------------------------------------------------------------
  const [createRack, {isLoading: isLoadingCreateRack}] = useCreateRackMutation();
  const [updateRack, {isLoading: isLoadingUpdateRack}] = useUpdateRackMutation();
  const [deleteRack, {isLoading: isLoadingDeleteRack}] = useDeleteRackMutation();

  // -- Function ----------------------------------------------------------------
  const handleClose = () => {
    dispatch(setIsOpenDialogAddOrEditRack(false));
    dispatch(setRackDataForUpdate(null));
  }

  const handleSubmit = async (values) => {
    try {
      if (rackDataForUpdate) {
        await updateRack({uuid: rackDataForUpdate.uuid, ...values}).unwrap();
        dispatch(setAlertRack({type: "success", message: "Update successfully"}));
      } else {
        await createRack(values).unwrap();
        dispatch(setAlertRack({type: "success", message: "Create successfully"}));
      }
      dispatch(setIsOpenSnackbarRack(true));
      handleClose();
    } catch (err) {
      console.error("Failed to create rack: ", err);
      dispatch(setAlertRack({type: "error", message: err.data?.error?.description || "Failed to create rack"}));
      dispatch(setIsOpenSnackbarRack(true));
    }
  }

  const handleEdit = (rack) => {
    dispatch(setRackDataForUpdate({
      uuid: rack.uuid,
      code: rack.code,
      isActive: rack.isActive,
      warehouseUuid: rack.warehouse?.uuid || "",
    }));
    dispatch(setIsOpenDialogAddOrEditRack(true));
  }

  const handleDelete = async () => {
    try {
      await deleteRack({uuid: rackDataForUpdate.uuid}).unwrap();
      dispatch(setIsOpenDeleteRackDialog(false));
      dispatch(setAlertRack({type: "success", message: "Delete successfully"}));
      dispatch(setIsOpenSnackbarRack(true));
    } catch (error) {
      dispatch(setIsOpenDeleteRackDialog(false));
      dispatch(setAlertRack({type: "error", message: error.data.error.description}));
      dispatch(setIsOpenSnackbarRack(true));
    }
  }

  const handleDeleteOpen = (rack) => {
    dispatch(setRackDataForUpdate(rack));
    dispatch(setIsOpenDeleteRackDialog(true));
  }

  const columns = [
      {
          id: "image",
          label: t("qr"),
          minWidth: 130,
          align: "left",
      },
      {
          id: "code",
          label: t("rackCode"),
          minWidth: 130,
          align: "left",
      },
      {
          id: "warehouse",
          label: t("warehouse"),
          minWidth: 130,
          align: "left",
          format: (value) => value?.name || "",
      },
      {
          id: "action",
          label: t("action"),
          minWidth: 130,
          align: "left",
      },
      
  ]

  const fields = [
      { name: "code",     label: "rackCode",     type: "text" },
      { name: "warehouseUuid",     
        label: "warehouse",     
        type: "autocomplete", 
        options: warehouseLookupData?.map((warehouse) => ({label: warehouse.name, value: warehouse.uuid})),
      },
      { name: "isActive", label: "active", type: "isActive" }, 
  ];
  const initialValues = {
        code: "",
        isActive: true,
        warehouseUuid: "",
    };

  return (
    <div className="pb-10">
      <Seo title="Rack List"/>
      <div className="card-glass">
        <div className="flex justify-between items-center">
          <BackButton onClick={() => navigate("/admin")}/>
          <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditRack(true))}/>
        </div>

        <TableCus
            columns={columns}
            data={rackData}
            // handleChangePage={handleChangePage}
            // handleChangeRowsPerPage={handleChangeRowsPerPage}
            // onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteOpen}
            // isFilterActive={true}
            // filterValue={filterValue}
            // handleFilterChange={handleFilterChange}
            // searchPlaceholderText={`${t('MO/PO/Style')}`}
            // onClearAllFilters={handleClearAllFilters}
            // onToggleActive={(entity) => handleToggleActive(entity)}
            // tToggleActive="Toggle status"
        />

        {
            isOpen && (
                <DialogAddEditCus
                    fields={fields}
                    title={rackDataForUpdate ? "Update Rack" : "Create Rack"}
                    isOpen={isOpen}
                    onClose={handleClose}
                    isUpdate={!!rackDataForUpdate}
                    // validationSchema={validationSchema}
                    handleSubmit={handleSubmit}
                    initialValues={rackDataForUpdate ? rackDataForUpdate : initialValues}
                    // isSubmitting={isLoadingCreateRack || isLoadingUpdateRack}
                />
            )
        }

      </div>
      <Snackbar
          open={isOpenSnackbarRack}
          autoHideDuration={6000}
          onClose={() => dispatch(setIsOpenSnackbarRack(false))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
          <Alert
              onClose={() => dispatch(setIsOpenSnackbarRack(false))}
              severity={alertRack.type}
              variant="filled"
              sx={{ width: '100%' }}
          >
              {alertRack.message}
          </Alert>
      </Snackbar>

      <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteRackDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteRack}/>
      
    </div>
  )
}

export default RackList