import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateColorMutation,
    useDeleteColorMutation, useGetColorQuery,
    useUpdateColorMutation
} from "../../redux/feature/color/colorApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setAlertColor,
    setColorDataForUpdate, setFilterColor, setIsOpenDeleteColorDialog,
    setIsOpenDialogAddOrEditColor, setIsOpenSnackbarColor,
    setPageNoColor,
    setPageSizeColor
} from "../../redux/feature/color/colorSlice.js";
import * as Yup from "yup";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import {Alert, Snackbar} from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";

function ColorList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const colorsDataForUpdate = useSelector((state) => state.color.colorDataForUpdate);
    const isOpen = useSelector((state) => state.color.isOpenDialogAddOrEditColor);
    const isOpenSnackbar = useSelector((state) => state.color.isOpenSnackbarColor);
    const alertColors = useSelector((state) => state.color.alertColor);
    const isOpenDeleteDialog = useSelector((state) => state.color.isOpenDeleteColorDialog);
    const[createColors, {isLoading: isLoadingCreateColors}] = useCreateColorMutation();
    const [updateColors, {isLoading: isLoadingUpdateColors}] = useUpdateColorMutation();
    const filterValue = useSelector((state) => state.color.filter);
    const debounceSearch = useDebounce(filterValue.search, 500);
    const [deleteColors, {isLoading: isLoadingDeleteColors}] = useDeleteColorMutation();
    const {data: colorsData, isLoading, isSuccess, isFetching} = useGetColorQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch,
    });

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterColor({
            ...filterValue,
            pageNo: newPage + 1,
        }))
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterColor({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditColor(false));
        dispatch(setColorDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        color: Yup.string().required(t("validation.required"))
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (colorsDataForUpdate) {
                await updateColors({
                    id: colorsDataForUpdate.id,
                    color: values.color,
                }).unwrap();
                dispatch(setAlertColor({type: "success", message: "Update successfully"}));
                dispatch(setColorDataForUpdate(null));
            }else {
                await createColors({
                    color: values.color,
                }).unwrap();
                dispatch(setAlertColor({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarColor(true));
            dispatch(setIsOpenDialogAddOrEditColor(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertColor({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarColor(true));
        }
    };

    const fields = [
        { name: "color",     label: "table.color",     type: "text" },
    ];

    const initialValues ={
        color: ""
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditColor(true));
        dispatch(setColorDataForUpdate(row));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteColorDialog(true));
        setId(row.id);
    };

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterColor({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterColor(newFilter));
    }

    const handleDelete = async () => {
        console.log(id);
        try {
            await deleteColors({id: id}).unwrap();
            dispatch(setIsOpenDeleteColorDialog(false));
            dispatch(setAlertColor({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarColor(true));
        }catch (error) {
            dispatch(setIsOpenDeleteColorDialog(false));
            dispatch(setAlertColor({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarColor(true));
        }
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterColor({
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
            id: "color",
            label: t("table.color"),
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
            <Seo title="Colors List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditColor(true))}/>
                </div>
                <TableCus
                    columns={columns}
                    data={colorsData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    isFetching={isFetching}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('table.color')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>
            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={colorsDataForUpdate ? "Update Colors" : "Create Colors"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!colorsDataForUpdate}
                        validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={colorsDataForUpdate ? colorsDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateColors || isLoadingUpdateColors}
                    />
                )
            }
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarColor(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarColor(false))}
                    severity={alertColors.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertColors.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteColorDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteColors}/>
        </div>
    )

    return content;
}
export default ColorList;