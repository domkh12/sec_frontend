import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAlertMaterialColor, setFilterMaterialColor, setIsOpenDeleteMaterialColorDialog, setIsOpenDialogAddOrEditMaterialColor, setIsOpenSnackbarMaterialColor, setMaterialColorDataForUpdate } from "../../redux/feature/materialColor/materialColorSlice";
import BackButton from "../../components/ui/BackButton";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import Seo from "../../components/seo/Seo";
import TableCus from "../../components/table/TableCus";
import { useCreateMaterialColorMutation, useDeleteMaterialColorMutation, useGetMaterialColorQuery, useUpdateMaterialColorMutation } from "../../redux/feature/materialColor/materialColorApiSlice";
import useDebounce from "../../hook/useDebounce";
import LoadingComponent from "../../components/ui/LoadingComponent";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { Alert, Snackbar } from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete";
import { useState } from "react";

function MaterialColorList() {
    // -- State -----------------------------------------------------------------------
    const [uuid, setUuid] = useState(null);

    // -- Selector -----------------------------------------------------------------------
    const materialColorDataForUpdate        = useSelector((state) => state.materialColor.materialColorDataForUpdate);
    const isOpen                            = useSelector((state) => state.materialColor.isOpenDialogAddOrEditMaterialColor);
    const isOpenSnackbarMaterialColor       = useSelector((state) => state.materialColor.isOpenSnackbarMaterialColor);
    const alertMaterialColor                = useSelector((state) => state.materialColor.alertMaterialColor);
    const filterValue                       = useSelector((state) => state.materialColor.filter);
    const isOpenDeleteDialog                = useSelector(state => state.materialColor.isOpenDeleteMaterialColorDialog);

    // -- Hook -----------------------------------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const searchTerm = useDebounce(filterValue.search, 500);

    // -- Query -----------------------------------------------------------------------
    const { data: materialColorData, isLoading: isMaterialColorLoading, isSuccess: isMaterialColorSuccess } = useGetMaterialColorQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: searchTerm
    });
    // -- Mutation -----------------------------------------------------------------------
    const [createMaterialColor, { isLoading: isCreateMaterialColorLoading }] = useCreateMaterialColorMutation();
    const [updateMaterialColor, { isLoading: isUpdateMaterialColorLoading }] = useUpdateMaterialColorMutation();
    const [deleteMaterialColor, { isLoading: isDeleteMaterialColorLoading }] = useDeleteMaterialColorMutation();
    
    // -- Function -----------------------------------------------------------------------
    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditMaterialColor(false));
        dispatch(setMaterialColorDataForUpdate(null));
    }

    const handleSubmit = async (values) => {
        if (materialColorDataForUpdate) {
            // Update logic here
            try {
                await updateMaterialColor({uuid: materialColorDataForUpdate.uuid, ...values}).unwrap();
                dispatch(setAlertMaterialColor({type: "success", message: "Update successfully"}));
                dispatch(setIsOpenSnackbarMaterialColor(true));
                handleClose();
            } catch (error) {
                dispatch(setAlertMaterialColor({type: "error", message: error.data?.error?.description || "Update failed"}));
                dispatch(setIsOpenSnackbarMaterialColor(true));
            }
        } else {
            // Create logic here
            try {
                await createMaterialColor(values).unwrap();
                dispatch(setAlertMaterialColor({type: "success", message: "Create successfully"}));
                dispatch(setIsOpenSnackbarMaterialColor(true));
                handleClose();
            } catch (error) {
                dispatch(setAlertMaterialColor({type: "error", message: error.data?.error?.description || "Create failed"}));
                dispatch(setIsOpenSnackbarMaterialColor(true));
            }
        }
    }

    const handleDeleteOpen = (row) => {
        setUuid(row.uuid);
        dispatch(setIsOpenDeleteMaterialColorDialog(true));
    }

    const handleDelete = async () => {
        try {
            await deleteMaterialColor({uuid: uuid}).unwrap();
            dispatch(setIsOpenDeleteMaterialColorDialog(false));
            dispatch(setAlertMaterialColor({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarMaterialColor(true));
        } catch (error) {
            dispatch(setIsOpenDeleteMaterialColorDialog(false));
            dispatch(setAlertMaterialColor({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarMaterialColor(true));
        }
    }

    const handleFilterChange = (key, value) => {
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterMaterialColor(newFilter));
    }

    const handleEdit = (row) => {
        dispatch(setMaterialColorDataForUpdate(row));
        dispatch(setIsOpenDialogAddOrEditMaterialColor(true));
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterMaterialColor({
            search: "",
        }));
    }

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterMaterialColor({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };
    
    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterMaterialColor({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const columns = [
        {
            id: "name",
            label: t("name"),
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
        { name: "name",     label: "name",     type: "text" },
    ];

    const initialValues = {
        name: "",
    };

    let content;

    if (isMaterialColorLoading) content = <LoadingComponent/>;

    if (isMaterialColorSuccess) content = (
        <div className="pb-10">
            <Seo title="Material Color List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditMaterialColor(true))}/>
                </div>
                 <TableCus
                    columns={columns}
                    data={materialColorData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('materialColorName')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>


             {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={materialColorDataForUpdate ? "Update Material Color" : "Create Material Color"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!materialColorDataForUpdate}
                        // validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={materialColorDataForUpdate ? materialColorDataForUpdate : initialValues}
                        // isSubmitting={isCreateMaterialColorLoading || isUpdateMaterialColorLoading}
                    />
                )
            }

            <Snackbar
                open={isOpenSnackbarMaterialColor}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarMaterialColor(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarMaterialColor(false))}
                    severity={alertMaterialColor.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMaterialColor.message}
                </Alert>
            </Snackbar>

             <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteMaterialColorDialog(false))} handleDelete={handleDelete} isSubmitting={isDeleteMaterialColorLoading}/>
        </div>
    )
    

    return content;
}

export default MaterialColorList;