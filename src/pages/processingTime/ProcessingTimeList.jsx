import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useUpdateWorkOrderMutation
} from "../../redux/feature/workOrder/workOrderApiSlice.js";
import {
    useDeleteBuyerMutation,
    useGetBuyerStatsQuery
} from "../../redux/feature/buyer/buyerApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setAlertBuyer,
    setFilterBuyer, setIsOpenDeleteBuyerDialog, setIsOpenSnackbarBuyer
} from "../../redux/feature/buyer/buyerSlice.js";
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
import {useGetOperationLookupQuery} from "../../redux/feature/operation/operationApiSlice.js";
import {
    useCreateProcessingTimeMutation,
    useGetProcessingTimeQuery
} from "../../redux/feature/processingTime/processingTimeApiSlice.js";
import {
    setAlertProcessingTime, setFilterProcessingTime,
    setIsOpenDeleteProcessingTimeDialog,
    setIsOpenDialogAddOrEditProcessingTime,
    setIsOpenSnackbarProcessingTime, setProcessingTimeDataForUpdate
} from "../../redux/feature/processingTime/processingTimeSlice.js";

function ProcessingTimeList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // -- Selector -------------------------------------------------------------------------------------------------
    const buyerDataForUpdate    = useSelector((state) => state.processingTime.processingTimeDataForUpdate);
    const isOpen                = useSelector((state) => state.processingTime.isOpenDialogAddOrEditProcessingTime);
    const isOpenSnackbar        = useSelector((state) => state.processingTime.isOpenSnackbarProcessingTime);
    const alertBuyer            = useSelector((state) => state.processingTime.alertProcessingTime);
    const isOpenDeleteDialog    = useSelector((state) => state.processingTime.isOpenDeleteProcessingTimeDialog);
    const filterValue           = useSelector((state) => state.processingTime.filter);

    // -- Mutation -------------------------------------------------------------------------------------------------
    const[createProcessingTime, {isLoading: isLoadingCreateProcessingTime}] = useCreateProcessingTimeMutation();
    const [updateWorkOrder, {isLoading: isLoadingUpdateBuyer}] = useUpdateWorkOrderMutation();
    const [deleteBuyer, {isLoading: isLoadingDeleteBuyer}] = useDeleteBuyerMutation();
    // -- Debounce -------------------------------------------------------------------------------------------------
    const debounceSearch = useDebounce(filterValue.search, 500);

    // -- Query ----------------------------------------------------------------------------------------------------
    const {data: buyerStats} = useGetBuyerStatsQuery();
    const {data: operationData} = useGetOperationLookupQuery();

    const {data: processingTimeData, isLoading, isSuccess, isFetching} = useGetProcessingTimeQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch
    });

    // -- Handler --------------------------------------------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterProcessingTime({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterProcessingTime({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditProcessingTime(false));
        dispatch(setProcessingTimeDataForUpdate(null));
    }

    const handleSubmit = async (values, {resetForm}) => {
        try {
            let operation = []
            for (let i = 0; i < values.process.length; i++) {
                operation.push({
                    operationId: values.process[i].id,
                    orderingNumber: values.process[i].index,
                })
            }

            if (buyerDataForUpdate) {
                await updateWorkOrder({
                    id: buyerDataForUpdate.id,
                    name: values.name,
                }).unwrap();
                dispatch(setAlertProcessingTime({type: "success", message: t('updateSuccess')}));
                dispatch(setProcessingTimeDataForUpdate(null));
            }else {
                await createProcessingTime({
                    style: values.style,
                    operation: operation
                }).unwrap();
                dispatch(setAlertProcessingTime({type: "success", message: t('createSuccess')}));
            }
            dispatch(setIsOpenSnackbarProcessingTime(true));
            dispatch(setIsOpenDialogAddOrEditProcessingTime(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertProcessingTime({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarProcessingTime(true));
        }
    };

    const handleEdit = (row) => {
        console.log(row);
        dispatch(setIsOpenDialogAddOrEditProcessingTime(true));
        dispatch(setProcessingTimeDataForUpdate({
            id: row.id,
            style: row.style,
            process: row.operation.map((item) => ({
                id: item.operationId,
                index: item.orderingNumber,
                _key: item.id,
            }))
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteBuyerDialog(true));
        setId(row.id);
    };

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterBuyer({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterBuyer(newFilter));
    }

    const handleDelete = async () => {
        console.log(id);
        try {
            await deleteBuyer({id: id}).unwrap();
            dispatch(setIsOpenDeleteBuyerDialog(false));
            dispatch(setAlertBuyer({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarBuyer(true));
        }catch (error) {
            dispatch(setIsOpenDeleteBuyerDialog(false));
            dispatch(setAlertBuyer({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarBuyer(true));
        }
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterBuyer({
            search: "",
        }))
    }

    const validationSchema = Yup.object().shape({
        style: Yup.string().required(t("validation.required")),
        process: Yup.array().min(1, "Please add at least one step").required(t("validation.required"))
    });

    const fields = [
        {
            name: "style",
            label: "table.style",
            type: "text",
        },
        {
            name: "process",
            label: "process",
            type: "steps",
            fullWidth: true,
            options: operationData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        }
    ];

    const initialValues ={
        style: "",
        process: []
    }

    const columns = [
        {
            id: "style",
            label: t("table.style"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "operation",
            label: t("process"),
            minWidth: 130,
            align: "left",
            arrayKey: "operationName"
        },
        {
            id: "createdAt",
            label: t("table.createdAt"),
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
            <Seo title="Processing Time List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditProcessingTime(true))}/>
                </div>
                <div>
                    <StatCards cards={[
                        {
                            label: t("stats.totalBuyers"),
                            value: buyerStats?.totalBuyer || 0,
                            color: "blue",
                            icon: <ApartmentIcon/>
                        },
                        {
                            label: t("stats.activeOrder"),
                            // Sums all lines from the current data list
                            value: buyerStats?.activeOrder || 0,
                            color: "violet",
                            icon: <PrecisionManufacturingIcon fontSize="small"/>
                        },
                        {
                            label: t("stats.totalPcs"),
                            // Sums all workers from the current data list
                            value: buyerStats?.totalPcs || 0,
                            color: "emerald",
                            icon: <PeopleAltRoundedIcon fontSize="small"/>
                        },
                    ]} />
                </div>
                <TableCus
                    columns={columns}
                    data={processingTimeData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    isFetching={isFetching}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('processingTime')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>
            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={buyerDataForUpdate ? "Update Processing Time" : "Create Processing Time"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!buyerDataForUpdate}
                        validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={buyerDataForUpdate ? buyerDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateProcessingTime || isLoadingUpdateBuyer}
                    />
                )
            }
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarProcessingTime(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarProcessingTime(false))}
                    severity={alertBuyer.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertBuyer.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteProcessingTimeDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteBuyer}/>
        </div>
    )

    return content;
}

export default ProcessingTimeList;