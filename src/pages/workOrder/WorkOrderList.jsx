import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateBuyerMutation,
    useDeleteBuyerMutation, useGetBuyerQuery, useGetBuyerStatsQuery,
    useUpdateBuyerMutation
} from "../../redux/feature/buyer/buyerApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setAlertBuyer,
    setBuyerDataForUpdate,
    setFilterBuyer, setIsOpenDeleteBuyerDialog,
    setIsOpenDialogAddOrEditBuyer, setIsOpenSnackbarBuyer
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
import {
    useCreateWorkOrderMutation,
    useUpdateWorkOrderMutation
} from "../../redux/feature/workOrder/workOrderApiSlice.js";
import {setAlertWorkOrder} from "../../redux/feature/workOrder/workOrderSlice.js";
import dayjs from "dayjs";

function WorkOrderList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const buyerDataForUpdate = useSelector((state) => state.buyer.buyerDataForUpdate);
    const isOpen = useSelector((state) => state.buyer.isOpenDialogAddOrEditBuyer);
    const isOpenSnackbar = useSelector((state) => state.buyer.isOpenSnackbarBuyer);
    const alertBuyer = useSelector((state) => state.buyer.alertBuyer);
    const isOpenDeleteDialog = useSelector((state) => state.buyer.isOpenDeleteBuyerDialog);
    const[createWorkOrder, {isLoading: isLoadingCreateBuyer}] = useCreateWorkOrderMutation();
    const [updateWorkOrder, {isLoading: isLoadingUpdateBuyer}] = useUpdateWorkOrderMutation();
    const filterValue = useSelector((state) => state.workOrder.filter);
    const debounceSearch = useDebounce(filterValue.search, 500);
    const [deleteBuyer, {isLoading: isLoadingDeleteBuyer}] = useDeleteBuyerMutation();
    const {data: buyerStats} = useGetBuyerStatsQuery();
    const {data: buyerData, isLoading, isSuccess, isFetching} = useGetBuyerQuery({
        pageNo: 1,
        pageSize: 999
    });

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterBuyer({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterBuyer({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditBuyer(false));
        dispatch(setBuyerDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        // name: Yup.string().required(t("validation.required"))
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            console.log(values);
            const startDate = dayjs(values.startDate).format("YYYY-MM-DD");
            const endDate = dayjs(values.endDate).format("YYYY-MM-DD");
            await createWorkOrder({
                mo: values.mo,
                qty: values.qty,
                style: values.style,
                startDate: startDate,
                endDate: endDate,
                buyerId: values.buyer,
            })
            // if (buyerDataForUpdate) {
            //     await updateWorkOrder({
            //         id: buyerDataForUpdate.id,
            //         name: values.name,
            //     }).unwrap();
            //     dispatch(setAlertBuyer({type: "success", message: "Update successfully"}));
            //     dispatch(setBuyerDataForUpdate(null));
            // }else {
            //     await updateWorkOrder({
            //         mo: values.mo,
            //         qty: values.qty,
            //         style: values.style,
            //         startDate: values.startDate,
            //         endDate: values.endDate
            //     }).unwrap();
            //     dispatch(setAlertWorkOrder({type: "success", message: "Create successfully"}));
            // }
            // dispatch(setIsOpenSnackbarBuyer(true));
            // dispatch(setIsOpenDialogAddOrEditBuyer(false));
            // resetForm();
        } catch (error) {
            dispatch(setAlertBuyer({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarBuyer(true));
        }
    };

    const fields = [
        { name: "mo",     label: "table.mo",     type: "text" },
        { name: "qty",     label: "table.qty",     type: "number" },
        { name: "style",     label: "table.style",     type: "text" },
        { name: "startDate",     label: "table.startDate",     type: "date" },
        { name: "endDate",     label: "table.endDate",     type: "date" },
        { name: "buyer",
          label: "table.buyer",
          type: "autocomplete",
            fetchOptions: async () => {
                return Object.values(buyerData?.entities ?? {}).map((dept) => ({
                    value: dept.id,
                    label: dept.name,
                }));
            },
        },
    ];

    const initialValues ={
        mo: "",
        qty: "",
        style: "",
        startDate: null,
        endDate: null,
        buyer: "",
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditBuyer(true));
        dispatch(setBuyerDataForUpdate(row));
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

    const columns = [
        {
            id: "mo",
            label: t("table.mo"),
            minWidth: 50,
            align: "left",
        },
        {
            id: "style",
            label: t("table.style"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "buyer",
            label: t("table.buyer"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "qty",
            label: t("table.workOrderQty"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "startDate",
            label: t("table.startDate"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "endDate",
            label: t("table.endDate"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "status",
            label: t("table.status"),
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
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditBuyer(true))}/>
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
                    data={buyerData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    isFetching={isFetching}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('table.buyer')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>
            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={buyerDataForUpdate ? "Update Work order" : "Create Work order"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!buyerDataForUpdate}
                        validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={buyerDataForUpdate ? buyerDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateBuyer || isLoadingUpdateBuyer}
                    />
                )
            }
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarBuyer(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarBuyer(false))}
                    severity={alertBuyer.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertBuyer.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteBuyerDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteBuyer}/>
        </div>
    )

    return content;
}

export default WorkOrderList;