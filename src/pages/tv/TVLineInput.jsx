import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions,
    DialogContent, DialogTitle, Divider, LinearProgress, MenuItem, Paper, Stack,
    Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Form, Formik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton.jsx";
import CardList from "../../components/ui/CardList.jsx";
import useAuth from "../../hook/useAuth.jsx";
import { createMockDailyRecord, createMockOrder, getMockTvLine, saveMockOrder } from "./mockTvLineApi.js";

const HOUR_KEYS = ["h8", "h9", "h10", "h11", "h13", "h14", "h15", "h16", "h17", "h18"];
const HOUR_LABELS = { h8: "08:00", h9: "09:00", h10: "10:00", h11: "11:00", h13: "13:00", h14: "14:00", h15: "15:00", h16: "16:00", h17: "17:00", h18: "18:00" };

const schema = Yup.object({
    orderNo: Yup.string().required("Order number is required"),
    orderQty: Yup.number().min(0).required("Required"),
    totalInLine: Yup.number().min(0).required("Required"),
    totalOutput: Yup.number().min(0).required("Required"),
    hTarg: Yup.number().min(0).required("Required"),
});

const sumHours = (record = {}) => HOUR_KEYS.reduce((sum, key) => sum + (Number(record[key]) || 0), 0);
const toFormValues = (order) => {
    const values = { ...order };
    delete values.dailyRecords;
    delete values.defects;
    values.startDate = order.startDate ? dayjs(order.startDate) : null;
    values.finishDate = order.finishDate ? dayjs(order.finishDate) : null;
    return values;
};

function Metric({ icon, label, value, helper, tone = "#2563eb" }) {
    return (
        <Box sx={{ p: 2, border: "1px solid #e8edf4", borderRadius: 2.5, bgcolor: "#fff", minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography>
                    <Typography variant="h5" fontWeight={800} color="#172033" mt={0.25}>{value}</Typography>
                    <Typography variant="caption" color="text.secondary">{helper}</Typography>
                </Box>
                <Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 2, color: tone, bgcolor: `${tone}14` }}>{icon}</Box>
            </Stack>
        </Box>
    );
}

function NumberInput({ value, onChange, defect = false, disabled = false }) {
    return (
        <TextField type="number" value={value ?? ""} disabled={disabled} onChange={(event) => onChange(event.target.value)}
            inputProps={{ "aria-label": defect ? "Defect quantity" : "Hourly output", min: 0, style: { textAlign: "center", fontWeight: 750, padding: "8px 4px" } }}
            sx={{ width: 68, "& input[type=number]": { MozAppearance: "textfield" }, "& input::-webkit-inner-spin-button": { display: "none" }, "& .MuiOutlinedInput-root": { bgcolor: defect ? "#fff7f7" : "#fff", color: defect ? "#c2414b" : "inherit" } }} />
    );
}

function TVLineInput() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [lineData, setLineData] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [notice, setNotice] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [newOrderNo, setNewOrderNo] = useState("");
    const [dailyRecordOpen, setDailyRecordOpen] = useState(false);
    const [newRecordDate, setNewRecordDate] = useState(dayjs());

    useEffect(() => {
        getMockTvLine().then((data) => {
            setLineData(data);
            setActiveOrderId(data.orders[0]?.id ?? null);
        });
    }, []);

    const activeOrder = useMemo(() => lineData?.orders.find((order) => order.id === activeOrderId), [lineData, activeOrderId]);

    const updateActiveOrder = useCallback((updater) => {
        setLineData((previous) => ({
            ...previous,
            orders: previous.orders.map((order) => order.id === activeOrderId ? updater(order) : order),
        }));
    }, [activeOrderId]);

    const updateHour = (recordId, key, value, isDefect = false) => {
        updateActiveOrder((order) => isDefect
            ? { ...order, defects: { ...order.defects, [key]: value } }
            : { ...order, dailyRecords: order.dailyRecords.map((record) => record.id === recordId ? { ...record, [key]: value } : record) });
    };

    const handleAddOrder = async () => {
        const name = newOrderNo.trim();
        if (!name) return;
        const created = await createMockOrder(name);
        setLineData((previous) => ({ ...previous, orders: [...previous.orders, created] }));
        setActiveOrderId(created.id);
        setNewOrderNo("");
        setAddOpen(false);
        setNotice({ severity: "success", text: `${name} created. Add its production details below.` });
    };

    const handleAddDailyRecord = async () => {
        if (!newRecordDate) return;
        const date = newRecordDate.format("YYYY-MM-DD");
        if (activeOrder.dailyRecords.some((record) => record.date === date)) {
            setNotice({ severity: "warning", text: `${activeOrder.orderNo} already has a record for ${newRecordDate.format("DD MMM YYYY")}.` });
            setDailyRecordOpen(false);
            return;
        }

        const record = await createMockDailyRecord(activeOrderId, date);
        updateActiveOrder((order) => ({
            ...order,
            dailyRecords: [
                ...order.dailyRecords.map((item) => ({ ...item, isToday: false })),
                record,
            ],
        }));
        setDailyRecordOpen(false);
        setNotice({ severity: "success", text: `Daily record added to ${activeOrder.orderNo}.` });
    };

    if (!lineData || !activeOrder) {
        return <Box minHeight="60vh" display="grid" sx={{ placeItems: "center" }}><CircularProgress /></Box>;
    }

    const today = activeOrder.dailyRecords.find((record) => record.isToday) ?? activeOrder.dailyRecords.at(-1);
    const todayOutput = sumHours(today);
    const defectTotal = sumHours(activeOrder.defects);
    const achievement = Number(today?.dTarg) > 0 ? Math.round((todayOutput / Number(today.dTarg)) * 100) : 0;
    const balance = Math.max(Number(activeOrder.orderQty) - Number(activeOrder.totalOutput), 0);

    return (
        <CardList>
            <Box maxWidth={1440} mx="auto" py={{ xs: 1, md: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2} mb={2.5}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <BackButton onClick={() => navigate(isAdmin ? "/admin/tv-menu" : "/manager/tv-menu")} />
                        <Box>
                            <Typography variant="caption" color="rgba(255,255,255,.72)" fontWeight={700} letterSpacing={1.5}>PRODUCTION INPUT</Typography>
                            <Typography variant="h4" color="white" fontWeight={850}>Line {lineData.line}</Typography>
                        </Box>
                    </Stack>
                    <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 750 }}>Add order</Button>
                </Stack>

                <Paper elevation={0} sx={{ p: 1, mb: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,.96)" }}>
                    <Stack direction={{ xs: "column", md: "row" }} gap={1}>
                        {lineData.orders.map((order) => {
                            const selected = order.id === activeOrderId;
                            const output = sumHours(order.dailyRecords.find((record) => record.isToday));
                            return (
                                <Button key={order.id} onClick={() => setActiveOrderId(order.id)} fullWidth
                                    sx={{ justifyContent: "flex-start", textAlign: "left", p: 1.5, borderRadius: 2.25, textTransform: "none", border: selected ? "1px solid #bfd3ff" : "1px solid transparent", bgcolor: selected ? "#edf4ff" : "transparent", "&:hover": { bgcolor: selected ? "#e6efff" : "#f6f8fb" } }}>
                                    <Box width="100%">
                                        <Typography color="#172033" fontWeight={800}>{order.orderNo}</Typography>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                            <Typography variant="caption" color="text.secondary">Today {output} pcs · Order {Number(order.orderQty).toLocaleString()} pcs</Typography>
                                            <Chip size="small" label={order.status === "COMPLETED" ? "Completed" : "Active"} color={order.status === "COMPLETED" ? "default" : "success"} sx={{ height: 20, fontSize: 10 }} />
                                        </Stack>
                                    </Box>
                                </Button>
                            );
                        })}
                    </Stack>
                </Paper>

                <Collapse in={Boolean(notice)}><Alert severity={notice?.severity} onClose={() => setNotice(null)} sx={{ mb: 2 }}>{notice?.text}</Alert></Collapse>

                <Formik key={activeOrder.id} initialValues={toFormValues(activeOrder)} validationSchema={schema} enableReinitialize
                    onSubmit={async (values, { setSubmitting }) => {
                        const current = lineData.orders.find((order) => order.id === activeOrderId);
                        const saved = { ...current, ...values, startDate: values.startDate?.format("YYYY-MM-DD") ?? null, finishDate: values.finishDate?.format("YYYY-MM-DD") ?? null };
                        await saveMockOrder(saved);
                        updateActiveOrder(() => saved);
                        setNotice({ severity: "success", text: `${saved.orderNo} saved successfully.` });
                        setSubmitting(false);
                    }}>
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                        <Form>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 330px" }, gap: 2 }}>
                                <Stack spacing={2} minWidth={0}>
                                    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3 }}>
                                        <Box mb={2}><Typography variant="h6" fontWeight={800}>Order details</Typography><Typography variant="body2" color="text.secondary">Identity, dates and production quantities for this style.</Typography></Box>
                                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2 }}>
                                            <TextField name="orderNo" label="Order No. / Style" value={values.orderNo} onChange={handleChange} onBlur={handleBlur} error={touched.orderNo && Boolean(errors.orderNo)} helperText={touched.orderNo && errors.orderNo} />
                                            <DatePicker label="Start date" value={values.startDate} onChange={(value) => setFieldValue("startDate", value)} />
                                            <DatePicker label="Finish date" value={values.finishDate} minDate={values.startDate ?? undefined} onChange={(value) => setFieldValue("finishDate", value)} />
                                            <TextField select name="status" label="Production status" value={values.status ?? "ACTIVE"} onChange={handleChange}>
                                                <MenuItem value="ACTIVE">Active</MenuItem>
                                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                            </TextField>
                                            {[
                                                ["orderQty", "Order quantity"], ["totalInLine", "Total in line"], ["totalOutput", "Total output"], ["balanceInLine", "Balance in line"],
                                                ["orderInline", "Order in line"], ["qcRepairBack", "QC repair back"], ["input", "Input"], ["balanceDay", "Balance days"],
                                            ].map(([key, label]) => <TextField key={key} type="number" name={key} label={label} value={values[key]} onChange={handleChange} onBlur={handleBlur} error={touched[key] && Boolean(errors[key])} helperText={touched[key] && errors[key]} />)}
                                        </Box>
                                    </Paper>

                                    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
                                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.5} p={{ xs: 2, md: 2.5 }} pb={1.5}>
                                            <Box><Typography variant="h6" fontWeight={800}>Hourly production</Typography><Typography variant="body2" color="text.secondary">Enter output per hour. Previous dates stay read-only.</Typography></Box>
                                            <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => { setNewRecordDate(dayjs()); setDailyRecordOpen(true); }} sx={{ textTransform: "none", fontWeight: 750, whiteSpace: "nowrap" }}>Add daily record</Button>
                                        </Stack>
                                        <Box sx={{ overflowX: "auto" }}>
                                            <Table size="small" sx={{ minWidth: 1120 }}>
                                                <TableHead><TableRow sx={{ bgcolor: "#f5f7fa" }}><TableCell>Date</TableCell><TableCell align="center">Daily target</TableCell>{HOUR_KEYS.map((key) => <TableCell key={key} align="center">{HOUR_LABELS[key]}</TableCell>)}<TableCell align="center">Total</TableCell><TableCell align="center">Rate</TableCell></TableRow></TableHead>
                                                <TableBody>
                                                    {activeOrder.dailyRecords.map((record) => {
                                                        const total = sumHours(record); const rate = Number(record.dTarg) ? Math.round(total / Number(record.dTarg) * 100) : 0;
                                                        return <TableRow key={record.id} sx={{ bgcolor: record.isToday ? "#f7faff" : "#fff" }}>
                                                            <TableCell><Stack direction="row" spacing={1} alignItems="center"><Typography fontWeight={700}>{dayjs(record.date).format("DD MMM")}</Typography>{record.isToday && <Chip label="Today" size="small" color="primary" />}</Stack></TableCell>
                                                            <TableCell align="center">{record.isToday ? <NumberInput value={record.dTarg} onChange={(value) => updateHour(record.id, "dTarg", value)} /> : <Typography fontWeight={650}>{record.dTarg}</Typography>}</TableCell>
                                                            {HOUR_KEYS.map((key) => <TableCell key={key} align="center">{record.isToday ? <NumberInput value={record[key]} onChange={(value) => updateHour(record.id, key, value)} /> : (record[key] ?? "—")}</TableCell>)}
                                                            <TableCell align="center"><Typography fontWeight={850}>{total}</Typography></TableCell><TableCell align="center"><Chip label={`${rate}%`} size="small" color={rate >= 90 ? "success" : rate >= 70 ? "warning" : "error"} /></TableCell>
                                                        </TableRow>;
                                                    })}
                                                    <TableRow sx={{ bgcolor: "#fffafa" }}><TableCell><Typography color="error.main" fontWeight={800}>Defects</Typography></TableCell><TableCell align="center">—</TableCell>{HOUR_KEYS.map((key) => <TableCell key={key} align="center"><NumberInput defect value={activeOrder.defects[key]} onChange={(value) => updateHour(null, key, value, true)} /></TableCell>)}<TableCell align="center"><Typography color="error.main" fontWeight={850}>{defectTotal}</Typography></TableCell><TableCell align="center">—</TableCell></TableRow>
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Paper>
                                </Stack>

                                <Stack spacing={2} sx={{ alignSelf: "start", position: { xl: "sticky" }, top: { xl: 16 } }}>
                                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}>
                                        <Typography variant="h6" fontWeight={800}>Today at a glance</Typography><Typography variant="body2" color="text.secondary" mb={2}>{dayjs(today.date).format("dddd, DD MMMM")}</Typography>
                                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
                                            <Metric label="Output" value={todayOutput} helper="pieces" tone="#2563eb" icon={<TrendingUpRoundedIcon fontSize="small" />} />
                                            <Metric label="Target" value={today.dTarg || 0} helper="pieces" tone="#7c3aed" icon={<Inventory2RoundedIcon fontSize="small" />} />
                                            <Metric label="People" value={lineData.worker + lineData.helper} helper={`${lineData.worker} + ${lineData.helper}`} tone="#0891b2" icon={<Groups2RoundedIcon fontSize="small" />} />
                                            <Metric label="Defects" value={defectTotal} helper="pieces" tone="#dc2626" icon={<CheckCircleRoundedIcon fontSize="small" />} />
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>Achievement</Typography><Typography fontWeight={850} color={achievement >= 90 ? "success.main" : "warning.dark"}>{achievement}%</Typography></Stack>
                                        <LinearProgress variant="determinate" value={Math.min(achievement, 100)} color={achievement >= 90 ? "success" : "warning"} sx={{ mt: 1, height: 8, borderRadius: 10 }} />
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}>
                                        <Typography fontWeight={800} mb={2}>Targets & capacity</Typography>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
                                                <TextField
                                                    type="number"
                                                    label="Workers"
                                                    value={lineData.worker}
                                                    onChange={(event) => setLineData((previous) => ({
                                                        ...previous,
                                                        worker: Math.max(Number(event.target.value), 0),
                                                    }))}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Helpers"
                                                    value={lineData.helper}
                                                    onChange={(event) => setLineData((previous) => ({
                                                        ...previous,
                                                        helper: Math.max(Number(event.target.value), 0),
                                                    }))}
                                                    inputProps={{ min: 0 }}
                                                />
                                            </Box>
                                            <TextField type="number" name="hTarg" label="Hourly target" value={values.hTarg} onChange={handleChange} error={touched.hTarg && Boolean(errors.hTarg)} helperText={touched.hTarg && errors.hTarg} />
                                            <TextField type="number" name="wHour" label="Working hours" value={values.wHour} onChange={handleChange} />
                                            <Metric label="Order balance" value={balance.toLocaleString()} helper="pieces remaining" tone="#d97706" icon={<CalendarMonthRoundedIcon fontSize="small" />} />
                                        </Stack>
                                    </Paper>
                                    <Button type="submit" variant="contained" size="large" startIcon={<SaveRoundedIcon />} disabled={isSubmitting} sx={{ py: 1.5, borderRadius: 2.5, textTransform: "none", fontWeight: 800 }}>{isSubmitting ? "Saving…" : `Save ${values.orderNo}`}</Button>
                                </Stack>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>

            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle fontWeight={800}>Add another order</DialogTitle><DialogContent><Typography color="text.secondary" mb={2}>This creates a separate workspace with its own targets, output and defects.</Typography><TextField autoFocus fullWidth label="Order No. / Style" value={newOrderNo} onChange={(event) => setNewOrderNo(event.target.value)} onKeyDown={(event) => event.key === "Enter" && handleAddOrder()} /></DialogContent>
                <DialogActions sx={{ p: 2 }}><Button onClick={() => setAddOpen(false)}>Cancel</Button><Button variant="contained" disabled={!newOrderNo.trim()} onClick={handleAddOrder}>Create order</Button></DialogActions>
            </Dialog>
            <Dialog open={dailyRecordOpen} onClose={() => setDailyRecordOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle fontWeight={800}>Add daily record</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" mb={2}>Create a new hourly production row for <strong>{activeOrder.orderNo}</strong>.</Typography>
                    <DatePicker label="Production date" value={newRecordDate} onChange={setNewRecordDate} sx={{ width: "100%" }} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}><Button onClick={() => setDailyRecordOpen(false)}>Cancel</Button><Button variant="contained" disabled={!newRecordDate} onClick={handleAddDailyRecord}>Create row</Button></DialogActions>
            </Dialog>
        </CardList>
    );
}

export default TVLineInput;
