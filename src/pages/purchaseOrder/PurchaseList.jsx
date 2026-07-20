import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as Yup from "yup";
import {Alert, Backdrop, Snackbar} from "@mui/material";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {
    useCreatePurchaseOrderMutation, useDeletePurchaseOrderMutation, useGetPurchaseOrderQuery,
    useUpdatePurchaseOrderMutation
} from "../../redux/feature/purchaseOrder/purchaseOrderApiSlice.js";
import {
    setAlertPurchaseOrder,
    setFilterPurchaseOrder, setIsOpenDeletePurchaseOrderDialog,
    setIsOpenDialogAddOrEditPurchaseOrder, setIsOpenSnackbarPurchaseOrder, setPurchaseOrderDataForUpdate
} from "../../redux/feature/purchaseOrder/purchaseOrderSlice.js";
import {useGetStyleLookupQuery} from "../../redux/feature/style/styleApiSlice.js";
import dayjs from "dayjs";
import {useBreakpoints} from "../../hook/useBreakpoints.jsx";
import {POSTATUS} from "../../config/po.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {useGetBuyerLookupQuery} from "../../redux/feature/buyer/buyerApiSlice.js";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";

function PurchaseList() {
    const [id, setId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // -- Selector --------------------------------------------------------------------------------------------

    const purchaseOrderDataForUpdate     = useSelector((s) => s.purchaseOrder.purchaseOrderDataForUpdate);
    const isOpen                   = useSelector((s) => s.purchaseOrder.isOpenDialogAddOrEditPurchaseOrder);
    const isOpenSnackbar           = useSelector((s) => s.purchaseOrder.isOpenSnackbarPurchaseOrder);
    const alertPurchaseOrder             = useSelector((s) => s.purchaseOrder.alertPurchaseOrder);
    const isOpenDeleteDialog       = useSelector((s) => s.purchaseOrder.isOpenDeletePurchaseOrderDialog);
    const filterValue              = useSelector((s) => s.purchaseOrder.filter);

    // -- Hook ------------------------------------------------------------------------------------------------
    const {isMd} = useBreakpoints();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const search = useDebounce(filterValue.search, 500);

    // -- Mutation -----------------------------------------------------------
    const [createPurchaseOrder]   = useCreatePurchaseOrderMutation();
    const [updatePurchaseOrder]   = useUpdatePurchaseOrderMutation();
    const [deletePurchaseOrder]   = useDeletePurchaseOrderMutation();

    // -- Query ---------------------------------------------------------------
    const {data: prodData,
        isLoading,
        isSuccess
    }                               = useGetPurchaseOrderQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: search,
        status: filterValue.status,
        styleId: filterValue.style,
        buyerId: filterValue.buyer
    });
    const {data: styleLookup}      = useGetStyleLookupQuery();
    const {data: buyerLookup}      = useGetBuyerLookupQuery();
    console.log(buyerLookup)

    // -- Handler ----------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterPurchaseOrder({
            ...filterValue,
            pageNo: newPage + 1,
        }))
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterPurchaseOrder({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditPurchaseOrder(false));
        dispatch(setPurchaseOrderDataForUpdate(null));
    }

    const handleSubmit = async (values, {resetForm}) => {
        setIsSubmitting(true);
        try {
            if (purchaseOrderDataForUpdate) {

                await updatePurchaseOrder({
                    id: purchaseOrderDataForUpdate.id,
                    po: values.po,
                    styleId: values.style,
                    qty: values.qty,
                    shipmentDate: dayjs(values.shipmentDate).format("YYYY-MM-DD"),
                    buyerId: values.buyer
                }).unwrap();
                dispatch(setAlertPurchaseOrder({type: "success", message: "Update successfully"}));
                dispatch(setPurchaseOrderDataForUpdate(null));
            }else {
                await createPurchaseOrder({
                    po: values.po,
                    styleId: values.style,
                    qty: values.qty,
                    shipmentDate: dayjs(values.shipmentDate).format("YYYY-MM-DD"),
                    buyerId: values.buyer
                }).unwrap();
                dispatch(setAlertPurchaseOrder({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
            dispatch(setIsOpenDialogAddOrEditPurchaseOrder(false));
            resetForm();
        } catch (error) {
            console.log(error);
            dispatch(setAlertPurchaseOrder({type: "error", message: error.data.error.description[0]?.reason ? error.data.error.description[0]?.reason : error.data.error.description}));
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
        }finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditPurchaseOrder(true));
        dispatch(setPurchaseOrderDataForUpdate({
            id: row?.id,
            style: row?.style?.id,
            po: row?.po,
            qty: row?.qty,
            shipmentDate: dayjs(row?.shipmentDate),
            buyer: row?.buyer?.id
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeletePurchaseOrderDialog(true));
        setId(row.id);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePurchaseOrder({ id }).unwrap();
            dispatch(setIsOpenDeletePurchaseOrderDialog(false));
            dispatch(setAlertPurchaseOrder({ type: "success", message: "Delete successfully" }));
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
        } catch (error) {
            dispatch(setIsOpenDeletePurchaseOrderDialog(false));
            dispatch(setAlertPurchaseOrder({ type: "error", message: error.data.error.description }));
            dispatch(setIsOpenSnackbarPurchaseOrder(true));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterPurchaseOrder(newFilter));
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterPurchaseOrder({
            search: "",
        }));
    }

    // -- Validation Schema ----------------------------------------------------------------------------------
    const validationSchema = Yup.object().shape({
        po: Yup.string()
            .required(t("validation.required"))
            .min(3, t("validation.tooShort")),
        qty: Yup.number()
            .required(t("validation.required"))
            .positive(t("validation.mustBePositive"))
            .integer(t("validation.mustBeInteger"))
            .typeError(t("validation.mustBeNumber")),
        shipmentDate: Yup.date()
            .required(t("validation.required"))
            .nullable()
            .typeError(t("validation.invalidDate")),
        style: Yup.mixed()
            .required(t("validation.required")),
        buyer: Yup.mixed()
            .required(t("validation.required")),
    });

    const fields = [
        { name: "po",     label: "po",     type: "text" },
        {
            name: "style",
            label: "style",
            type: "autocomplete",
            options: styleLookup?.map((style) => ({
                value: style.id,
                label: style.styleNo,
            })),
        },
        { name: "qty",     label: "totalOrderQty",     type: "number" },
        { name: "shipmentDate",     label: "shipmentDate",     type: "date" },
        {
            name: "buyer",
            label: "buyer",
            type: "autocomplete",
            options: buyerLookup?.map((buyer) => ({
                value: buyer?.id,
                label: buyer?.name,
            })),
        },

    ];

    const filterConfig = [
        {
            id: 'style',
            label: t("style"),
            width: isMd ? 150 : "100%",
            options: styleLookup?.map((style) => ({
                value: style?.id,
                label: style?.styleNo
            }))
        },
        {
            id: 'buyer',
            label: t("buyer"),
            width: isMd ? 150 : "100%",
            options: buyerLookup?.map((buyer) => ({
                value: buyer?.id,
                label: buyer?.name
            }))
        },
        {
            id: 'status',
            label: t("table.status"),
            width: isMd ? 150 : "100%",
            options: POSTATUS.map((status) => ({
                value: status.id,
                label: status.label
            }))
        },
    ]

    const initialValues = {
        po: "",
        qty: 0,
        shipmentDate: null,
        style: null,
        buyer: null
    };

    const columns = [
        {
            id: "po",
            label: t("po"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "style",
            label: t("style"),
            minWidth: 130,
            align: "left",
            format: (style => style?.styleNo)
        },
        {
            id: "qty",
            label: t("totalOrderQty"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "shipmentDate",
            label: t("shipmentDate"),
            minWidth: 120,
            align: "left",
            format: (value) => value ? dayjs(value).format("DD-MM-YYYY") : ""
        },
        {
            id: "buyer",
            label: t("buyer"),
            minWidth: 130,
            align: "left",
            format: (buyer => buyer?.name)
        },
        {
            id: "status",
            label: t("status"),
            minWidth: 100,
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
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditPurchaseOrder(true))}/>
                </div>
                <TableCus
                    columns={columns}
                    data={prodData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    searchPlaceholderText={`${t("po")}`}
                    filterConfig={filterConfig}
                    handleFilterChange={handleFilterChange}
                    onClearAllFilters={handleClearAllFilters}
                />
            </div>

            <DialogAddEditCus
                fields={fields}
                title={purchaseOrderDataForUpdate ? "Update PurchaseOrder" : "Create PurchaseOrder"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={!!purchaseOrderDataForUpdate}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                initialValues={purchaseOrderDataForUpdate ? purchaseOrderDataForUpdate : initialValues}
                isSubmitting={isSubmitting}
            />

            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarPurchaseOrder(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarPurchaseOrder(false))}
                    severity={alertPurchaseOrder.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertPurchaseOrder.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeletePurchaseOrderDialog(false))} handleDelete={handleDelete} isSubmitting={isDeleting}/>
        </div>
    )

    return content;
}

export default PurchaseList;