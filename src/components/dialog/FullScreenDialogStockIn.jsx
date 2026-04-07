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
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import {
    setIsFullScreenDialogStockIn,
    setStockInData
} from "../../redux/feature/material/materialSlice.js";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialogStockIn() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // Redux
    const open = useSelector((s) => s.material.isFullScreenDialogStockIn);
    const stockData = useSelector((s) => s.material.stockInData);

    // Form state
    const [value, setValue] = React.useState(dayjs());
    const [form, setForm] = React.useState({
        qty: ""
    });

    // Static table data
    const rows = [
        { id: 1, date: "2026-04-01", qty: 100, user: "Admin" },
        { id: 2, date: "2026-04-03", qty: 50, user: "John" },
        { id: 3, date: "2026-04-05", qty: 200, user: "Manager" },
    ];

    const handleClose = () => {
        dispatch(setIsFullScreenDialogStockIn(false));
        dispatch(setStockInData(null));
        setForm({ qty: "" });
        setValue(dayjs());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!form.qty) {
            alert("Please input quantity");
            return;
        }

        const payload = {
            materialId: stockData?.id,
            qty: form.qty,
            date: value.format("YYYY-MM-DD")
        };

        console.log("Submit:", payload);

        // TODO: connect API here

        handleClose();
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            slots={{ transition: Transition }}
        >
            {/* HEADER */}
            <AppBar sx={{ position: 'relative' }}>
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
                            Material Information
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
                            Stock In Form
                        </Typography>

                        <TextField
                            label="Quantity"
                            name="qty"
                            type="number"
                            value={form.qty}
                            InputProps={{ inputProps: { min: 0 } }}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        />

                        <DatePicker
                            label="Date of Stock In"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true
                                }
                            }}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={!form.qty}
                        >
                            Save Stock In
                        </Button>
                    </div>
                </div>

                {/* RIGHT SIDE IMAGE */}
                <div className="bg-white shadow rounded-2xl p-5 flex flex-col items-center justify-center">
                    <Typography variant="subtitle1" className="mb-4">
                        Material Image
                    </Typography>

                    <img
                        src={stockData?.image || "/images/placeholder.png"}
                        alt="Material"
                        className="w-full max-h-[300px] object-contain rounded-lg"
                    />
                </div>



            </div>
            {/* STOCK HISTORY TABLE */}
            <div className="bg-white shadow rounded-2xl p-5 flex flex-col gap-4 mx-5">
                <Typography variant="h6">
                    Stock In History
                </Typography>

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
                            {rows.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {dayjs(row.date).format("DD-MM-YYYY")}
                                    </TableCell>
                                    <TableCell>{row.qty}</TableCell>
                                    <TableCell>{row.user}</TableCell>
                                </TableRow>
                            ))}

                            {/* TOTAL ROW */}
                            <TableRow>
                                <TableCell colSpan={2}><b>Total</b></TableCell>
                                <TableCell>
                                    <b>
                                        {rows.reduce((sum, r) => sum + r.qty, 0)}
                                    </b>
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Dialog>
    );
}