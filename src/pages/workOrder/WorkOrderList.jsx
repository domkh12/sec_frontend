import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { useGetBuyerQuery,
} from "../../redux/feature/buyer/buyerApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setAlertBuyer,
    setFilterBuyer, setIsOpenDeleteBuyerDialog,
    setIsOpenSnackbarBuyer
} from "../../redux/feature/buyer/buyerSlice.js";
import * as Yup from "yup";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import StatCards from "../../components/card/StatCards.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import {Alert, Snackbar} from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {
    useCreateWorkOrderMutation, useDeleteWorkOrderMutation, useGetWorkOrderQuery, useGetWorkOrderStatsQuery,
    useUpdateWorkOrderMutation
} from "../../redux/feature/workOrder/workOrderApiSlice.js";
import {
    setAlertWorkOrder, setFilterWorkOrder, setIsOpenDeleteWorkOrderDialog,
    setIsOpenDialogAddOrEditWorkOrder,
    setIsOpenSnackbarWorkOrder, setWorkOrderDataForUpdate
} from "../../redux/feature/workOrder/workOrderSlice.js";
import dayjs from "dayjs";
import {useGetColorQuery} from "../../redux/feature/color/colorApiSlice.js";
import {useGetSizeQuery} from "../../redux/feature/size/sizeApiSlice.js";
import useAuth from "../../hook/useAuth.jsx";
import FactoryIcon from '@mui/icons-material/Factory';
import { FaDolly } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { FaHourglassEnd } from "react-icons/fa";
import {setAlertMaterial, setIsOpenSnackbarMaterial} from "../../redux/feature/material/materialSlice.js";
import {useUploadFileMutation} from "../../redux/feature/file/fileApiSlice.js";

function WorkOrderList() {
    const [id, setId] = useState(null);

    // -- Hook  ----------------------------------------------------------------------------------------------------
    const {isAdmin, isManager} = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    // -- Selector -------------------------------------------------------------------------------------------------
    const woDataForUpdate    = useSelector((state) => state.workOrder.workOrderDataForUpdate);
    const isOpen                = useSelector((state) => state.workOrder.isOpenDialogAddOrEditWorkOrder);
    const isOpenSnackbar        = useSelector((state) => state.workOrder.isOpenSnackbarWorkOrder);
    const alertWO            = useSelector((state) => state.workOrder.alertWorkOrder);
    const isOpenDeleteDialog    = useSelector((state) => state.workOrder.isOpenDeleteWorkOrderDialog);
    const filterValue           = useSelector((state) => state.workOrder.filter);

    // -- Mutation -------------------------------------------------------------------------------------------------
    const[createWorkOrder, {isLoading: isLoadingCreateWO}] = useCreateWorkOrderMutation();
    const [updateWorkOrder, {isLoading: isLoadingUpdateWO}] = useUpdateWorkOrderMutation();
    const [deleteWO, {isLoading: isLoadingDeleteWO}] = useDeleteWorkOrderMutation();
    const [uploadFile, {isLoading: isLoadingUploadFile}] = useUploadFileMutation();

    // -- Debounce -------------------------------------------------------------------------------------------------
    const debounceSearch = useDebounce(filterValue.search, 500);

    // -- Query ----------------------------------------------------------------------------------------------------
    const {data: buyerData} = useGetBuyerQuery({
        pageNo: 1,
        pageSize: 1000
    });
    const {data: colorData} = useGetColorQuery({
        pageNo: 1,
        pageSize: 1000
    });
    const {data: sizeData} = useGetSizeQuery({
        pageNo: 1,
        pageSize: 1000
    })
    const {data: workOrderData, isLoading, isSuccess, isFetching} = useGetWorkOrderQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch
    });
    const {data: workOrderStatData} = useGetWorkOrderStatsQuery();

    // -- Handler --------------------------------------------------------------------------------------------------

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterWorkOrder({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterWorkOrder({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditWorkOrder(false));
        dispatch(setWorkOrderDataForUpdate(null));
    }

    const handleSubmit = async (values, {resetForm}) => {
        let imageUri = null;

        if (values.image && typeof values.image !== "string") {
            const formData = new FormData();
            formData.append("file", values.image);
            try{
                const res = await uploadFile(formData).unwrap();
                imageUri = res.uri;
            }catch (error) {
                console.log(error);
                dispatch(setAlertMaterial({type: "error", message: error.data.error.description}));
                dispatch(setIsOpenSnackbarMaterial(true));
                return;
            }
        }

        try {
            const startDate = dayjs(values.startDate).format("YYYY-MM-DD");
            const endDate = dayjs(values.endDate).format("YYYY-MM-DD");

            if (woDataForUpdate) {
                await updateWorkOrder({
                    id: woDataForUpdate.id,
                    mo: values.mo,
                    po: values.po,
                    qty: values.qty,
                    style: values.style,
                    startDate: startDate,
                    endDate: endDate,
                    buyerId: values.buyer,
                    sizeIds: values.size,
                    colorId: values.color,
                    image: imageUri
                }).unwrap();
                dispatch(setAlertWorkOrder({type: "success", message: "Update successfully"}));
                dispatch(setWorkOrderDataForUpdate(null));
            }else {
                await createWorkOrder({
                    mo: values.mo,
                    po: values.po,
                    qty: values.qty,
                    style: values.style,
                    startDate: startDate,
                    endDate: endDate,
                    buyerId: values.buyer,
                    sizeIds: values.size,
                    colorId: values.color,
                    image: imageUri
                }).unwrap();
                dispatch(setAlertWorkOrder({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarWorkOrder(true));
            dispatch(setIsOpenDialogAddOrEditWorkOrder(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertWorkOrder({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarWorkOrder(true));
        }
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditWorkOrder(true));
        dispatch(setWorkOrderDataForUpdate({
            id: row?.id,
            mo: row?.mo,
            po: row?.po,
            qty: row?.qty,
            style: row?.style,
            startDate: dayjs(row?.startDate, "DD-MM-YYYY"),
            endDate: dayjs(row?.endDate, "DD-MM-YYYY"),
            buyer: row?.buyer?.id,
            size: row?.sizes?.map(size => size?.id),
            color: row?.color?.id,
            image: row?.image
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteWorkOrderDialog(true));
        setId(row.id);
    };

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterWorkOrder({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterWorkOrder(newFilter));
    }

    const handleDelete = async () => {
        try {
            await deleteWO({id: id}).unwrap();
            dispatch(setIsOpenDeleteWorkOrderDialog(false));
            dispatch(setAlertWorkOrder({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarWorkOrder(true));
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
        // name: Yup.string().required(t("validation.required"))
    });

    const fields = [
        { name: "mo",     label: "table.mo",     type: "text" },
        { name: "po",     label: "po",     type: "text" },
        { name: "style",     label: "style",     type: "text" },
        {
            name: "size",
            label: "table.size",
            type: "autocomplete-checkbox",
            fetchOptions: async () => {
                return Object.values(sizeData?.entities ?? {}).map((dept) => ({
                    value: dept.id,
                    label: dept.size,
                }));
            },
        },
        {
            name: "color",
            label: "table.color",
            type: "autocomplete",
            fetchOptions: async () => {
                return Object.values(colorData?.entities ?? {}).map((dept) => ({
                    value: dept.id,
                    label: dept.color,
                }));
            },
        },
        { name: "qty",     label: "table.qty",     type: "number" },
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
        {
            name: "image",
            label: "image",
            type: "image"
        }

    ];

    const initialValues ={
        mo: "",
        po: "",
        qty: "",
        style: "",
        image: "",
        startDate: null,
        endDate: null,
        buyer: "",
        colors: [],
    }

    const columns = [
        {
            id: "image",
            label: t("image"),
            minWidth: 130,
            align: "left",
        },,
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
            id: "po",
            label: t("po"),
            minWidth: 70,
            align: "left"
        },
        {
            id: "color",
            label: t("color"),
            minWidth: 100,
            align: "left",
            format: (value) => value?.color ?? "—"
        },
        {
            id: "sizes",
            label: t("size"),
            minWidth: 160,
            align: "left",
            format: (value) => {
                if (!value && !Array.isArray(value)) return "—";
                return value.map(item => item.size).join(", ");
            }
        },
        {
            id: "buyer",
            label: t("table.buyer"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.name ?? "—",
        },
        {
            id: "qty",
            label: t("table.qty"),
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
            <Seo title="Work Order List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate(`${isAdmin ? "/admin" : isManager ? "/manager" : "/"}`)}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditWorkOrder(true))}/>
                </div>
                <div>
                    <StatCards cards={[
                        {
                            label: t("totalMO"),
                            value: workOrderStatData?.totalMO || 0,
                            color: "blue",
                            icon: <FactoryIcon/>
                        },
                        {
                            label: t("totalWorkQty"),
                            // Sums all workers from the current data list
                            value: workOrderStatData?.totalWorkOrderQty || 0,
                            color: "amber",
                            icon: <FaDolly />
                        },
                        {
                            label: t("totalOutputQty"),
                            // Sums all workers from the current data list
                            value: workOrderStatData?.totalOutput || 0,
                            color: "emerald",
                            icon: <FaCheckCircle />
                        },
                        {
                            label: t("totalBalance"),
                            // Sums all lines from the current data list
                            value: workOrderStatData?.totalBalance || 0,
                            color: "red",
                            icon: <FaHourglassEnd />
                        },

                    ]} />
                </div>
                <TableCus
                    columns={columns}
                    data={workOrderData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    isFetching={isFetching}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('MO')}`}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>
            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={woDataForUpdate ? "Update Work order" : "Create Work order"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!woDataForUpdate}
                        validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={woDataForUpdate ? woDataForUpdate : initialValues}
                        isSubmitting={isLoadingUploadFile || isLoadingCreateWO || isLoadingUpdateWO}
                    />
                )
            }
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarWorkOrder(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarWorkOrder(false))}
                    severity={alertWO.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertWO.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteWorkOrderDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteWO}/>
        </div>
    )

    return content;
}

export default WorkOrderList;