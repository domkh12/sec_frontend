import * as React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Dialog,
    Slide,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, TablePagination
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import {
    setAlertMaterialStockIn,
    setFilterStockIn,
    setIsFullScreenDialogStockIn, setIsOpenSnackbarMaterialStockIn,
    setStockInData
} from "../../redux/feature/material/materialSlice.js";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {useState} from "react";
import "react-day-picker/dist/style.css";
import {
    useGetMaterialStockInExcelMutation,
    useGetStockInQuery,
    useStockInMutation
} from "../../redux/feature/material/materialApiSlice.js";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {green} from "@mui/material/colors";
import {PiMicrosoftExcelLogoFill} from "react-icons/pi";
import NumberField from "../ui/NumberField.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialogStockIn() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [range, setRange] = useState();
    const [openDate, setOpenDate] = useState(false);

    // -- Selector ----------------------------------------------------------------------------
    const open          = useSelector((s) => s.material.isFullScreenDialogStockIn);
    const stockData     = useSelector((s) => s.material.stockInData);
    const filterValue   = useSelector((s) => s.material.filterStockIn);

    // -- State -------------------------------------------------------------------------------
    const [value, setValue]    = useState(dayjs());

    // -- Mutation -----------------------------------------------------------------------------
    const [stockIn, {isLoading, isSuccess}] = useStockInMutation();
    const [reportStockInExcel, {isLoading: isLoadingStockInExcel}] = useGetMaterialStockInExcelMutation();

    // -- Queries ------------------------------------------------------------------------------
    const { data: stockInData } = useGetStockInQuery(
        {
            pageNo: filterValue?.pageNo,
            pageSize: filterValue?.pageSize,
            materialId: stockData?.id
        },
        {skip: !stockData?.id}
    );

    // -- Validation --------------------------------------------------------------------------
    const validationSchema = Yup.object({
        qty: Yup.number()
            .typeError("Quantity must be a number")
            .required("Quantity is required")
            .positive("Must be greater than 0"),
        dateInput: Yup.date()
            .required("Date is required")
    });

    // -- Handler ----------------------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterStockIn({
            ...filterValue,
            pageNo: newPage + 1,
        }))
    }

    const handleChangeRowsPerPage = (event, newPage) => {
        dispatch(setFilterStockIn({
            ...filterValue,
            pageSize: parseInt(event.target.value, 10),
            pageNo: 1
        }));
    }

    const handleClose = () => {
        dispatch(setIsFullScreenDialogStockIn(false));
        dispatch(setStockInData(null));
        setValue(dayjs());
    };

    const handleSubmit = async ({values}) => {
        if (!values.qty) {
            alert("Please input quantity");
            return;
        }
        try {
            await stockIn({
                materialId: stockData?.id,
                qtyInput: values.qty,
                dateInput: value.format("YYYY-MM-DDTHH:mm:ss")
            }).unwrap();
        }catch (error) {
            console.log(error);
            dispatch(setAlertMaterialStockIn({
                type: "error",
                message: error?.data?.error?.description || "Something went wrong"
            }));
            dispatch(setIsOpenSnackbarMaterialStockIn(true));
        }

        handleClose();
    };

    const handleExportExcel = async () => {
        const res = await reportStockInExcel().unwrap();

        // Create blob
        const blob = new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create URL
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = url.substring(url.lastIndexOf("/"), url.length); // file name
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
    }

    const { ids, entities, totalElements, pageSize, pageNo } = stockInData || {};
    let tableContent;

    tableContent = ids?.length > 0 ? (
        ids.map((id, index) => (
            <TableRow key={id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entities[id]?.dateInput}</TableCell>
                <TableCell sx={{
                    color: "green",
                    fontWeight: "semibold",
                }}>+ {entities[id]?.qtyInput} {entities[id]?.unit}</TableCell>
                <TableCell>{entities[id]?.user}</TableCell>

            </TableRow>
        ))
    ): (
        <TableRow>
            <TableCell colSpan={4} align="center">
                No data available
            </TableCell>
        </TableRow>
    )

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
                            <TextField label="Code" value={stockData?.code || ""} disabled fullWidth size="small" />
                            <TextField label="Name" value={stockData?.name || ""} disabled fullWidth size="small" />
                            <TextField label="Unit" value={stockData?.unit || ""} disabled fullWidth size="small" />
                            <TextField label="Balance Stock" value={stockData?.balance || 0} disabled fullWidth size="small" />
                        </div>
                    </div>

                    {/* STOCK IN FORM */}
                    <div className="bg-white shadow rounded-2xl p-5 flex flex-col gap-4">
                        <Typography variant="h6">
                            {t('material.stockInForm')}
                        </Typography>
                        <Formik
                            initialValues={{
                                qty: "",
                                dateInput: value,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => handleSubmit({ values })}
                        >
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleChange,
                                  handleSubmit,
                                  setFieldValue
                              }) => (
                                <Form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                    <NumberField label="Quantity" name="qty" value={values.qty} onChange={(val) => setFieldValue("qty", val)} size="small" min={0.001}/>

                                    {/* DATE PICKER FIX */}
                                    <DatePicker
                                        label="Date of Stock In"
                                        value={values.dateInput}
                                        onChange={(newValue) => {
                                            setFieldValue("dateInput", newValue);
                                            setValue(newValue); // keep your local state if needed
                                        }}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                fullWidth: true,
                                                error: touched.dateInput && Boolean(errors.dateInput),
                                                helperText: touched.dateInput && errors.dateInput
                                            }
                                        }}
                                    />

                                    {/* BUTTON */}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        Save Stock In
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
                        {t('material.stockInHistory')}
                    </Typography>
                    <Button loading={isLoadingStockInExcel} variant="contained" size="small" sx={{bgcolor: green[600]}} startIcon={<PiMicrosoftExcelLogoFill/>} onClick={handleExportExcel}>
                        Export
                    </Button>
                </div>
                <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>User</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableContent}
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    totalElements > 0 && (
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
                    )
                }

            </div>
        </Dialog>
    );
}