import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAlertUnit, setFilterUnit, setIsOpenDeleteUnitDialog, setIsOpenDialogAddOrEditUnit, setIsOpenSnackbarUnit, setPageNoUnit, setPageSizeUnit, setUnitDataForUpdate } from "../../redux/feature/unit/unitSlice";
import BackButton from "../../components/ui/BackButton";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import TableCus from "../../components/table/TableCus";
import { useTranslation } from "react-i18next";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { useCreateUnitMutation, useDeleteUnitMutation, useGetUnitQuery, useUpdateUnitMutation } from "../../redux/feature/unit/unitApiSlice";
import { Alert, Snackbar } from "@mui/material";
import LoadingComponent from "../../components/ui/LoadingComponent";
import useDebounce from "../../hook/useDebounce";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete";
import { useState } from "react";

function UnitList() {

    // -- State ----------------------------------------------
    const [uuid, setUuid] = useState(null);

    // -- Selector ----------------------------------------------
    const isOpen                = useSelector(state => state.unit.isOpenDialogAddOrEditUnit);
    const unitDataForUpdate     = useSelector(state => state.unit.unitDataForUpdate);
    const isOpenSnackbarUnit    = useSelector(state => state.unit.isOpenSnackbarUnit);
    const alertUnit             = useSelector(state => state.unit.alertUnit);
    const filterValue           = useSelector(state => state.unit.filter);
    const search                = useDebounce(filterValue.search, 500);
    const isOpenDeleteDialog    = useSelector(state => state.unit.isOpenDeleteUnitDialog);

    // -- Query ----------------------------------------------
    const { data: unitData, isLoading, isSuccess } = useGetUnitQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: search
    });

    // -- Hook -----------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // -- Mutation -------------------------------------------
    const [createUnit, { isLoading: isCreateUnitLoading }] = useCreateUnitMutation();
    const [updateUnit, { isLoading: isUpdateUnitLoading }] = useUpdateUnitMutation();
    const [deleteUnit, { isLoading: isDeleteUnitLoading }] = useDeleteUnitMutation();

    // -- Function -------------------------------------------
    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditUnit(false));
    } 

    const handleDelete = async () => {
        try {
            await deleteUnit({uuid: uuid}).unwrap();
            dispatch(setIsOpenDeleteUnitDialog(false));
            dispatch(setAlertUnit({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarUnit(true));
        } catch (error) {
            dispatch(setIsOpenDeleteUnitDialog(false));
            dispatch(setAlertUnit({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarUnit(true));
        }
    }

    const handleSubmit = async (values) => {
        try {
            if (unitDataForUpdate) {
                await updateUnit({uuid: unitDataForUpdate.uuid, ...values}).unwrap();
                dispatch(setAlertUnit({type: "success", message: "Update successfully"}));
            }else{
                await createUnit(values).unwrap();
                dispatch(setAlertUnit({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarUnit(true));
            handleClose();
        } catch (err) {
            console.error("Failed to create unit: ", err);
            dispatch(setAlertUnit({type: "error", message: err.data?.error?.description || "Failed to create unit"}));
            dispatch(setIsOpenSnackbarUnit(true));
        }
    }

    const handleEdit = (row) => {
        dispatch(setUnitDataForUpdate(row));
        dispatch(setIsOpenDialogAddOrEditUnit(true));
    }

    const handleDeleteOpen = (row) => {
        setUuid(row.uuid);
        dispatch(setIsOpenDeleteUnitDialog(true));
    }

    const handleFilterChange = (key, value) => {
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterUnit(newFilter));
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterUnit({
            search: "",
        }));
    }

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterUnit({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };
    
    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterUnit({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const columns = [
        {
            id: "unitCode",
            label: t("unitCode"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "unitName",
            label: t("unitName"),
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
        { name: "unitCode",     label: "unitCode",     type: "text" },
        { name: "unitName",     label: "unitName",     type: "text" },
    ];

    const initialValues = {
        unitCode: "",
        unitName: "",
    };

    let content;

    if(isLoading) content = <LoadingComponent/>;

    if(isSuccess) content = (
        <div className="pb-10">
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditUnit(true))}/>
                </div>
                 <TableCus
                    columns={columns}
                    data={unitData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('unitCode')} / ${t('unitName')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>


            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={unitDataForUpdate ? "Update Unit" : "Create Unit"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!unitDataForUpdate}
                        // validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={unitDataForUpdate ? unitDataForUpdate : initialValues}
                        isSubmitting={isCreateUnitLoading || isUpdateUnitLoading}
                    />
                )
            }

            <Snackbar
                open={isOpenSnackbarUnit}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarUnit(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarUnit(false))}
                    severity={alertUnit.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertUnit.message}
                </Alert>
            </Snackbar>

             <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteUnitDialog(false))} handleDelete={handleDelete} isSubmitting={isDeleteUnitLoading}/>
        </div>
    )

    return content;
}

export default UnitList;