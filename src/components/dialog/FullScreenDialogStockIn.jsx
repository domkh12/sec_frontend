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
    setFilterStockIn,
    setIsFullScreenDialogStockIn,
    setStockInData
} from "../../redux/feature/material/materialSlice.js";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import {useGetStockInQuery, useStockInMutation} from "../../redux/feature/material/materialApiSlice.js";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {setFilterUser} from "../../redux/feature/user/userSlice.js";

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
        await stockIn({
            materialId: stockData?.id,
            qtyInput: values.qty,
            dateInput: value.format("YYYY-MM-DDTHH:mm:ss")
        }).unwrap();

        handleClose();
    };
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
                }}>+ {entities[id]?.qtyInput}</TableCell>
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

                                    {/* QTY */}
                                    <TextField
                                        label="Quantity"
                                        name="qty"
                                        type="number"
                                        value={values.qty}
                                        onChange={handleChange}
                                        fullWidth
                                        size="small"
                                        error={touched.qty && Boolean(errors.qty)}
                                        helperText={touched.qty && errors.qty}
                                    />

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
                <Typography variant="h6">
                    {t('material.stockInHistory')}
                </Typography>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <button onClick={() => setOpenDate(!openDate)}>Date</button>
                    <div>
                        {range?.from && `From: ${dayjs(range.from).format("DD-MM-YYYY")}`}
                        {range?.to && ` → To: ${dayjs(range.to).format("DD-MM-YYYY")}`}
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
                                <button onClick={() => { setRange(undefined); }}>Clear</button>
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
                                <TableCell>User</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableContent}
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    totalElements && (
                        <TablePagination
                            rowsPerPageOptions={[20, 50, 100, 1000]}
                            component="div"
                            count={totalElements || 0}
                            rowsPerPage={pageSize}
                            labelRowsPerPage={t("table.rowPerPage")}
                            page={pageNo}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            // sx={paginationSx}
                        />
                    )
                }

            </div>
        </Dialog>
    );
}