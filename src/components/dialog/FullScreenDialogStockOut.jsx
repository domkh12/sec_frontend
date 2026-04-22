import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {useDispatch, useSelector} from "react-redux";
import {
    setAlertMaterialStockOut,
    setFilterStockOut,
    setIsFullScreenDialogStockOut, setIsOpenSnackbarMaterial, setIsOpenSnackbarMaterialStockOut, setStockOutData
} from "../../redux/feature/material/materialSlice.js";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import dayjs from "dayjs";
import {
    useGetStockOutQuery,
    useStockOutMutation
} from "../../redux/feature/material/materialApiSlice.js";
import * as Yup from "yup";
import {
    Alert,
    Button, FormHelperText,
    Paper, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField
} from "@mui/material";
import {Form, Formik} from "formik";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {DayPicker} from "react-day-picker";
import SelectUserWithSearch from "../select/SelectUserWithSearch.jsx";
import NumberField from "../ui/NumberField.jsx";
import {green} from "@mui/material/colors";
import {PiMicrosoftExcelLogoFill} from "react-icons/pi";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialogStockOut() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [range, setRange] = useState();
    const [openDate, setOpenDate] = useState(false);

    // -- Selector ----------------------------------------------------------------------------
    const open                    = useSelector((s) => s.material.isFullScreenDialogStockOut);
    const stockData               = useSelector((s) => s.material.stockOutData);
    const filterValue             = useSelector((s) => s.material.filterStockOut);
    const isOpenSnackbarStockOut  = useSelector((s) => s.material.isOpenSnackbarMaterialStockOut);
    const alertMaterialStockOut   = useSelector((s) => s.material.alertMaterialStockOut);

    // -- State -------------------------------------------------------------------------------
    const [value, setValue] = useState(dayjs());

    // -- Mutation -----------------------------------------------------------------------------
    const [stockOut, {isLoading}] = useStockOutMutation();

    // -- Queries ------------------------------------------------------------------------------
    const { data: stockInData } = useGetStockOutQuery(
        {
            pageNo: filterValue?.pageNo,
            pageSize: filterValue?.pageSize,
            materialId: stockData?.id
        },
        { skip: !stockData?.id }
    );

    // -- Validation --------------------------------------------------------------------------
    const validationSchema = Yup.object({
        qty: Yup.number()
            .typeError("Quantity must be a number")
            .required("Quantity is required")
            .positive("Must be greater than 0"),
        dateInput: Yup.mixed()
            .required("Date is required")
            .test("is-valid-date", "Invalid date", (val) => val && dayjs(val).isValid()),
        employee: Yup.object()
            .nullable()
            .required("Employee is required")
            .test("has-id", "Employee is required", (val) => val && val.id),
    });

    // -- Handler ----------------------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterStockOut({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        dispatch(setFilterStockOut({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1
        }));
    };

    const handleClose = () => {
        dispatch(setIsFullScreenDialogStockOut(false));
        dispatch(setStockOutData(null));
        setValue(dayjs());
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await stockOut({
                materialId: stockData?.id,
                qtyOutput: values.qty,
                dateOutput: dayjs(values.dateInput).format("YYYY-MM-DDTHH:mm:ss"),
                requesterId: values.employee?.id,
            }).unwrap();
            handleClose();
        } catch (error) {
            dispatch(setAlertMaterialStockOut({
                type: "error",
                message: error?.data?.error?.description || "Something went wrong"
            }));
            dispatch(setIsOpenSnackbarMaterialStockOut(true));
        } finally {
            setSubmitting(false);
        }
    };

    const { ids, entities, totalElements, pageSize, pageNo } = stockInData || {};

    const tableContent = ids?.length > 0 ? (
        ids.map((id, index) => (
            <TableRow key={id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entities[id]?.dateOutput}</TableCell>
                <TableCell sx={{ color: "red", fontWeight: "semibold" }}>
                    − {entities[id]?.qtyOutput} {entities[id]?.unit}
                </TableCell>
                <TableCell>{entities[id]?.requester}</TableCell>
            </TableRow>
        ))
    ) : (
        <TableRow>
            <TableCell colSpan={4} align="center">No data available</TableCell>
        </TableRow>
    );

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            slots={{ transition: Transition }}
        >
            {/* HEADER */}
            <AppBar sx={{ position: 'sticky', top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                        {t("table.stockIn")}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* CONTENT */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT SIDE */}
                <div className="col-span-2 flex flex-col gap-6">

                    {/* MATERIAL INFO */}
                    <div className="bg-white shadow rounded-2xl p-5 flex flex-col gap-4">
                        <Typography variant="h6">
                            {t('material.information')}
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField label="Code"          value={stockData?.code    || ""} disabled fullWidth size="small" />
                            <TextField label="Name"          value={stockData?.name    || ""} disabled fullWidth size="small" />
                            <TextField label="Unit"          value={stockData?.unit    || ""} disabled fullWidth size="small" />
                            <TextField label="Balance Stock" value={stockData?.balance || 0}  disabled fullWidth size="small" />
                        </div>
                    </div>

                    {/* STOCK OUT FORM */}
                    <div className="bg-white shadow rounded-2xl p-5 flex flex-col gap-4">
                        <Typography variant="h6">
                            {t('material.stockOutForm')}
                        </Typography>

                        <Formik
                            initialValues={{
                                qty: "",          // null so Yup .required() triggers correctly
                                dateInput: dayjs(),
                                employee: null,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                                <Form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                    {/* QUANTITY */}
                                    <NumberField
                                        label="Quantity"
                                        name="qty"
                                        value={values.qty}
                                        onChange={(val) => setFieldValue("qty", val)}
                                        onBlur={() => setFieldTouched("qty", true)}
                                        size="small"
                                        min={0.001}
                                    />
                                    {touched.qty && errors.qty && (
                                        <FormHelperText error sx={{ mt: -2, ml: 0 }}>
                                            {errors.qty}
                                        </FormHelperText>
                                    )}

                                    {/* DATE PICKER */}
                                    <DatePicker
                                        label="Date of Stock Out"
                                        value={values.dateInput}
                                        onChange={(newValue) => {
                                            setFieldValue("dateInput", newValue);
                                            setValue(newValue);
                                        }}
                                        onClose={() => setFieldTouched("dateInput", true)}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                fullWidth: true,
                                                onBlur: () => setFieldTouched("dateInput", true),
                                                error: touched.dateInput && Boolean(errors.dateInput),
                                                helperText: touched.dateInput && errors.dateInput,
                                            }
                                        }}
                                    />

                                    {/* EMPLOYEE */}
                                    <SelectUserWithSearch
                                        onChange={(val) => {
                                            setFieldValue("employee", val);
                                            setFieldTouched("employee", true);
                                        }}
                                        error={touched.employee && Boolean(errors.employee)}
                                    />
                                    {touched.employee && errors.employee && (
                                        <FormHelperText error sx={{ mt: -2, ml: 0 }}>
                                            {errors.employee}
                                        </FormHelperText>
                                    )}

                                    {/* SUBMIT */}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        Save Stock Out
                                    </Button>

                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {/* RIGHT SIDE IMAGE */}
                <div className="bg-white shadow rounded-2xl p-5 flex flex-col items-center justify-center">
                    <Typography variant="subtitle1" className="mb-4">
                        {t('material.image')}
                    </Typography>
                    <img
                        src={stockData?.image || "/images/placeholder.png"}
                        alt="Material"
                        className="w-full max-h-[300px] object-contain rounded-lg"
                    />
                </div>

            </div>

            {/* STOCK HISTORY TABLE */}
            <div className="bg-white shadow rounded-2xl p-5 flex flex-col gap-4 mx-5 mb-10">
                <div className="flex justify-between items-center">
                    <Typography variant="h6">
                        {t('material.stockOutHistory')}
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: green[600] }}
                        startIcon={<PiMicrosoftExcelLogoFill />}
                    >
                        Export
                    </Button>
                </div>

                {/* DATE RANGE FILTER */}
                <div style={{ position: "relative", display: "inline-block" }}>
                    <button onClick={() => setOpenDate(!openDate)}>Date</button>
                    <div>
                        {range?.from && `From: ${dayjs(range.from).format("DD-MM-YYYY")}`}
                        {range?.to   && ` → To: ${dayjs(range.to).format("DD-MM-YYYY")}`}
                    </div>
                    {openDate && (
                        <div style={{
                            position: "absolute", top: "110%", left: 0,
                            background: "white", border: "1px solid #ddd",
                            borderRadius: 8, padding: 12, zIndex: 100,
                            boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
                        }}>
                            <DayPicker
                                mode="range"
                                selected={range}
                                onSelect={(r) => setRange(r)}
                                numberOfMonths={2}
                            />
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                <button onClick={() => setRange(undefined)}>Clear</button>
                                <button onClick={() => setOpenDate(false)}>Apply</button>
                            </div>
                        </div>
                    )}
                </div>

                <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Employee</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableContent}
                        </TableBody>
                    </Table>
                </TableContainer>

                {totalElements > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 1000]}
                        component="div"
                        count={totalElements || 0}
                        rowsPerPage={pageSize}
                        labelRowsPerPage={t("table.rowPerPage")}
                        page={pageNo}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
            </div>

            {/* SNACKBAR */}
            <Snackbar
                open={isOpenSnackbarStockOut}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarMaterialStockOut(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarMaterialStockOut(false))}
                    severity={alertMaterialStockOut.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMaterialStockOut.message}
                </Alert>
            </Snackbar>

        </Dialog>
    );
}