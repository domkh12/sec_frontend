import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useDebounce from "../../hook/useDebounce.jsx";
import * as Yup from "yup";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import StatCards from "../../components/card/StatCards.jsx";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import {Alert, Snackbar} from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {
    useCreateDefectTypeMutation, useDeleteDefectTypeMutation,
    useGetDefectTypeQuery, useUpdateDefectTypeMutation
} from "../../redux/feature/defect-type/defectTypeApiSlice.js";
import {
    setAlertDefectType, setDefectTypeDataForUpdate, setFilterDefectType, setIsOpenDeleteDefectTypeDialog,
    setIsOpenDialogAddOrEditDefectType, setIsOpenSnackbarDefectType
} from "../../redux/feature/defect-type/defectTypeSlice.js";

function DefectTypeList() {
    // -- State --------------------------------------------------------------------------------------------------------
    const [id, setId] = useState(null);

    // -- Hook ---------------------------------------------------------------------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    // -- Selector -----------------------------------------------------------------------------------------------------
    const defectTypeDataForUpdate       = useSelector((s) => s.defectType.defectTypeDataForUpdate);
    const isOpen                   = useSelector((s) => s.defectType.isOpenDialogAddOrEditDefectType);
    const isOpenSnackbar           = useSelector((s) => s.defectType.isOpenSnackbarDefectType);
    const alertDefectType               = useSelector((s) => s.defectType.alertDefectType);
    const isOpenDeleteDialog       = useSelector((s) => s.defectType.isOpenDeleteDefectTypeDialog);
    const filterValue              = useSelector((s) => s.defectType.filter);

    // -- Mutation -----------------------------------------------------------------------------------------------------
    const[createDefectType, {isLoading: isLoadingCreateDefectType}] = useCreateDefectTypeMutation();
    const [updateDefectType, {isLoading: isLoadingUpdateDefectType}] = useUpdateDefectTypeMutation();
    const [deleteDefectType, {isLoading: isLoadingDeleteDefectType}] = useDeleteDefectTypeMutation();

    // -- debounce -----------------------------------------------------------------------------------------------------
    const debounceSearch = useDebounce(filterValue.search, 500);

    // -- Query --------------------------------------------------------------------------------------------------------
    const {data: defectTypeStats} = useGetDefectTypeQuery();
    const {data: defectTypeData, isLoading, isSuccess, isFetching} = useGetDefectTypeQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch,
    });

    // -- Handler ------------------------------------------------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterDefectType({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterDefectType({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditDefectType(false));
        dispatch(setDefectTypeDataForUpdate(null));
    }

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (defectTypeDataForUpdate) {
                await updateDefectType({
                    id: defectTypeDataForUpdate.id,
                    name: values.name,
                }).unwrap();
                dispatch(setAlertDefectType({type: "success", message: "Update successfully"}));
                dispatch(setDefectTypeDataForUpdate(null));
            }else {
                await createDefectType({
                    name: values.name,
                }).unwrap();
                dispatch(setAlertDefectType({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarDefectType(true));
            dispatch(setIsOpenDialogAddOrEditDefectType(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertDefectType({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarDefectType(true));
        }
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditDefectType(true));
        dispatch(setDefectTypeDataForUpdate(row));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteDefectTypeDialog(true));
        setId(row.id);
    };

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterDefectType({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterDefectType(newFilter));
    }

    const handleDelete = async () => {
        try {
            await deleteDefectType({id: id}).unwrap();
            dispatch(setIsOpenDeleteDefectTypeDialog(false));
            dispatch(setAlertDefectType({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarDefectType(true));
        }catch (error) {
            dispatch(setIsOpenDeleteDefectTypeDialog(false));
            dispatch(setAlertDefectType({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarDefectType(true));
        }
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterDefectType({
            search: "",
        }))
    }

    const fields = [
        { name: "name",     label: "table.defectType",     type: "text" },
    ];

    const initialValues ={
        name: ""
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("validation.required"))
    });


    const columns = [
        {
            id: "id",
            label: "#",
            minWidth: 50,
            align: "left",
        },
        {
            id: "name",
            label: t("table.defectType"),
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
            <Seo title="Buyer List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditDefectType(true))}/>
                </div>
                <div>
                    <StatCards cards={[
                        {
                            label: t("stats.totalDefectTypes"),
                            value: defectTypeStats?.totalBuyer || 0,
                            color: "blue",
                            icon: <ApartmentIcon/>
                        },
                        {
                            label: t("stats.topDefectType"),
                            // Sums all lines from the current data list
                            value: defectTypeStats?.activeOrder || 0,
                            color: "violet",
                            icon: <PrecisionManufacturingIcon fontSize="small"/>
                        },
                        {
                            label: t("stats.defectsToday"),
                            // Sums all workers from the current data list
                            value: defectTypeStats?.totalPcs || 0,
                            color: "emerald",
                            icon: <PeopleAltRoundedIcon fontSize="small"/>
                        },
                        {
                            label: t("stats.defectRate"),
                            // Sums all workers from the current data list
                            value: defectTypeStats?.totalPcs || 0,
                            color: "emerald",
                            icon: <PeopleAltRoundedIcon fontSize="small"/>
                        },
                    ]} />
                </div>
                <TableCus
                    columns={columns}
                    data={defectTypeData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    isFetching={isFetching}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('table.defectType')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>
            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={defectTypeDataForUpdate ? "Update Defect Type" : "Create Defect Type"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!defectTypeDataForUpdate}
                        validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={defectTypeDataForUpdate ? defectTypeDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateDefectType || isLoadingUpdateDefectType}
                    />
                )
            }
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarDefectType(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarDefectType(false))}
                    severity={alertDefectType.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertDefectType.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete
                isOpen={isOpenDeleteDialog}
                onClose={() => dispatch(setIsOpenDeleteDefectTypeDialog(false))}
                handleDelete={handleDelete}
                isSubmitting={isLoadingDeleteDefectType}
            />
        </div>
    )

    return content;
}

export default DefectTypeList;