import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateSizeMutation,
    useDeleteSizeMutation, useGetSizeQuery, useGetSizeStatsQuery,
    useUpdateSizeMutation
} from "../../redux/feature/size/sizeApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setAlertSize,
    setSizeDataForUpdate, setFilterSize, setIsOpenDeleteSizeDialog,
    setIsOpenDialogAddOrEditSize, setIsOpenSnackbarSize,
    setPageNoSize,
    setPageSizeSize
} from "../../redux/feature/size/sizeSlice.js";
import * as Yup from "yup";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import {Alert, Snackbar} from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";

function SizeList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const pageNo = useSelector((state) => state.size.pageNo);
    const pageSize = useSelector((state) => state.size.pageSize);
    const sizeDataForUpdate = useSelector((state) => state.size.sizeDataForUpdate);
    const isOpen = useSelector((state) => state.size.isOpenDialogAddOrEditSize);
    const isOpenSnackbar = useSelector((state) => state.size.isOpenSnackbarSize);
    const alertSize = useSelector((state) => state.size.alertSize);
    const isOpenDeleteDialog = useSelector((state) => state.size.isOpenDeleteSizeDialog);
    const[createSize, {isLoading: isLoadingCreateSize}] = useCreateSizeMutation();
    const [updateSize, {isLoading: isLoadingUpdateSize}] = useUpdateSizeMutation();
    const filterValue = useSelector((state) => state.size.filter);
    const debounceSearch = useDebounce(filterValue.search, 500);
    const [deleteSize, {isLoading: isLoadingDeleteSize}] = useDeleteSizeMutation();
    const {data: sizeStats} = useGetSizeStatsQuery();
    const {data: sizeData, isLoading, isSuccess, isFetching} = useGetSizeQuery({
        pageNo: pageNo,
        pageSize: pageSize,
        search: debounceSearch,
    });

    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoSize(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeSize(event.target.value));
        dispatch(setPageNoSize(1));
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditSize(false));
        dispatch(setSizeDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        size: Yup.string().required(t("validation.required"))
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (sizeDataForUpdate) {
                await updateSize({
                    id: sizeDataForUpdate.id,
                    size: values.size,
                }).unwrap();
                dispatch(setAlertSize({type: "success", message: "Update successfully"}));
                dispatch(setSizeDataForUpdate(null));
            }else {
                await createSize({
                    size: values.size,
                }).unwrap();
                dispatch(setAlertSize({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarSize(true));
            dispatch(setIsOpenDialogAddOrEditSize(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertSize({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarSize(true));
        }
    };

    const fields = [
        { name: "size",     label: "table.size",     type: "text" },
    ];

    const initialValues ={
        size: ""
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditSize(true));
        dispatch(setSizeDataForUpdate(row));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteSizeDialog(true));
        setId(row.id);
    };

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterSize({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterSize(newFilter));
    }

    const handleDelete = async () => {
        try {
            await deleteSize({id: id}).unwrap();
            dispatch(setIsOpenDeleteSizeDialog(false));
            dispatch(setAlertSize({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarSize(true));
        }catch (error) {
            dispatch(setIsOpenDeleteSizeDialog(false));
            dispatch(setAlertSize({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarSize(true));
        }
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterSize({
            search: "",
        }))
    }

    const columns = [
        {
            id: "id",
            label: t("table.id"),
            minWidth: 50,
            align: "left",
        },
        {
            id: "size",
            label: t("table.size"),
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

    if (isLoading) content = (<LoadingComponent/>);

    if (isSuccess) content = (
        <div className="pb-10">
            <Seo title="Size List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditSize(true))}/>
                </div>
                <TableCus
                    columns={columns}
                    data={sizeData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    isFetching={isFetching}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('table.size')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>
            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={sizeDataForUpdate ? "Update Size" : "Create Size"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!sizeDataForUpdate}
                        validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={sizeDataForUpdate ? sizeDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateSize || isLoadingUpdateSize}
                    />
                )
            }
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarSize(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarSize(false))}
                    severity={alertSize.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertSize.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteSizeDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteSize}/>
        </div>
    )

    return content;
}
export default SizeList;