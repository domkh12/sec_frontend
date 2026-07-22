import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert, Box, Button, Checkbox, Chip, CircularProgress, Collapse, Dialog, DialogActions,
    DialogContent, DialogTitle, Divider, LinearProgress, MenuItem, Paper, Select, Stack,
    Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, IconButton,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Form, Formik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/ui/BackButton.jsx";
import CardList from "../../components/ui/CardList.jsx";
import useAuth from "../../hook/useAuth.jsx";
import { useGetStyleLookupQuery } from "../../redux/feature/style/styleApiSlice.js";
import { useCreateOrderMutation, useCreateTvDataMutation, useGetTvDataQuery, useUpdateTvDataMutation } from "../../redux/feature/tv/tvApiSlice.js";

const HOUR_KEYS = ["h8", "h9", "h10", "h11", "h13", "h14", "h15", "h16", "h17", "h18"];
const HOUR_LABELS = { h8: "08:00", h9: "09:00", h10: "10:00", h11: "11:00", h13: "13:00", h14: "14:00", h15: "15:00", h16: "16:00", h17: "17:00", h18: "18:00" };

const schema = Yup.object({
    orderNo: Yup.string().required("Order number is required"),
    orderQty: Yup.number().min(0).required("Required"),
    totalInLine: Yup.number().min(0).required("Required"),
    totalOutput: Yup.number().min(0).required("Required"),
    hTarg: Yup.number().min(0).required("Required"),
});

const sumHours = (record) => {
    const safeRecord = record ?? {};
    return HOUR_KEYS.reduce((sum, key) => sum + (Number(safeRecord[key]) || 0), 0);
};
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

function StyleSettingsDialog({ open, orders, checkedStyles, onToggle, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle fontWeight={800}>Style settings</DialogTitle>
            <DialogContent dividers>
                <Typography color="text.secondary" mb={1.5}>
                    Checked styles are active. Completed and pending styles are unchecked.
                </Typography>
                <Stack spacing={0.75}>
                    {orders.length === 0 && <Typography color="text.secondary">No styles found.</Typography>}
                    {orders.map((order) => (
                        <Paper key={order.id} variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Checkbox
                                    checked={Boolean(checkedStyles[order.id])}
                                    onChange={(event) => onToggle(order.id, event.target.checked)}
                                    inputProps={{ "aria-label": `Set ${order.orderNo} active` }}
                                />
                                <Box flex={1} minWidth={0}>
                                    <Typography fontWeight={750} noWrap>{order.orderNo}</Typography>
                                    <Typography variant="caption" color="text.secondary">{order.status ?? "PENDING"}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={onClose}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

function TVLineInput() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [lineData, setLineData] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [notice, setNotice] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [checkedStyles, setCheckedStyles] = useState({});
    const [newStyleId, setNewStyleId] = useState("");
    const tvName = useParams().name;

    // -- Query ----------------------------------------------------------
    const {data: styleData} = useGetStyleLookupQuery();

    // -- Mutation --------------------------------------------------------
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
    const [createTvData, { isLoading: isCreatingTvData }] = useCreateTvDataMutation();
    const [updateTvData] = useUpdateTvDataMutation();

    const {
        data: getTvData,
        isLoading: isTvDataLoading,
        isError: isTvDataError,
        error: tvDataError,
        refetch,
    } = useGetTvDataQuery({ name: tvName });

    // Keep an editable local copy of the backend response. Preserve the
    // selected order when polling or cache invalidation returns fresh data.
    useEffect(() => {
        if (!getTvData) return;

        const orders = Array.isArray(getTvData.orders) ? getTvData.orders : [];
        let cancelled = false;
        queueMicrotask(() => {
            if (cancelled) return;
            setLineData({ ...getTvData, orders });
            const activeOrders = orders.filter((order) => order.status === "ACTIVE");
            setActiveOrderId((currentId) => (
                activeOrders.some((order) => order.id === currentId)
                    ? currentId
                    : (activeOrders[0]?.id ?? null)
            ));
        });

        return () => {
            cancelled = true;
        };
    }, [getTvData]);

    const activeOrders = useMemo(
        () => (lineData?.orders ?? []).filter((order) => order.status === "ACTIVE"),
        [lineData]
    );
    const activeOrder = useMemo(() => activeOrders.find((order) => order.id === activeOrderId), [activeOrders, activeOrderId]);

    const openStyleSettings = () => {
        setCheckedStyles(Object.fromEntries(
            (lineData?.orders ?? []).map((order) => [order.id, order.status === "ACTIVE"])
        ));
        setSettingsOpen(true);
    };

    const updateActiveOrder = useCallback((updater) => {
        setLineData((previous) => previous ? ({
            ...previous,
            orders: (previous.orders ?? []).map((order) => order.id === activeOrderId ? updater(order) : order),
        }) : previous);
    }, [activeOrderId]);

    const updateHour = (recordId, key, value, isDefect = false) => {
        updateActiveOrder((order) => isDefect
            ? { ...order, defects: { ...(order.defects ?? {}), [key]: value } }
            : { ...order, dailyRecords: (order.dailyRecords ?? []).map((record) => record.id === recordId ? { ...record, [key]: value } : record) });
    };

    const handleAddOrder = async () => {
        if (!newStyleId) return;

        const selectedStyle = styleData?.find(
            (style) => String(style?.id) === String(newStyleId)
        );

        try {
            const created = await createOrder({
                tvName,
                styleId: newStyleId,
            }).unwrap();

            if (created?.id != null) setActiveOrderId(created.id);
            setNewStyleId("");
            setAddOpen(false);
            setNotice({
                severity: "success",
                text: `${selectedStyle?.styleNo ?? "Order"} created successfully.`,
            });
            await refetch();
        } catch (error) {
            setNotice({
                severity: "error",
                text: error?.data?.error?.description
                    ?? error?.data?.message
                    ?? "Unable to create order.",
            });
        }
    };

    const handleAddDailyRecord = async () => {
        if (!activeOrderId) return;

        const todayDate = dayjs().format("YYYY-MM-DD");
        if (activeOrder?.dailyRecords?.some((record) => record?.date === todayDate)) {
            setNotice({
                severity: "warning",
                text: `${activeOrder?.orderNo ?? "This order"} already has today's daily record.`,
            });
            return;
        }

        try {
            await createTvData({
                name: tvName,
                tvOrderId: activeOrderId,
            }).unwrap();

            setNotice({
                severity: "success",
                text: `Today's daily record was added to ${activeOrder?.orderNo ?? "the order"}.`,
            });
            await refetch();
        } catch (error) {
            setNotice({
                severity: "error",
                text: error?.data?.error?.description
                    ?? error?.data?.message
                    ?? "Unable to create today's daily record.",
            });
        }
    };

    if (isTvDataError) {
        return <Alert severity="error">{tvDataError?.data?.error?.description ?? "Unable to load TV line data."}</Alert>;
    }

    if (isTvDataLoading || !lineData) {
        return <Box minHeight="60vh" display="grid" sx={{ placeItems: "center" }}><CircularProgress /></Box>;
    }

    if (!activeOrder) {
        return (
            <CardList>
                <Box mx="auto" py={{ xs: 2, md: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                        <BackButton onClick={() => navigate(isAdmin ? "/admin/tv-menu" : "/manager/tv-menu")} />
                        <Box>
                            <Typography variant="caption" color="rgba(255,255,255,.72)" fontWeight={700} letterSpacing={1.5}>PRODUCTION INPUT</Typography>
                            <Typography variant="h4" color="white" fontWeight={850}>Line {lineData?.line ?? "—"}</Typography>
                        </Box>
                    </Stack>

                    <Collapse in={Boolean(notice)}>
                        <Alert severity={notice?.severity} onClose={() => setNotice(null)} sx={{ mb: 2 }}>
                            {notice?.text}
                        </Alert>
                    </Collapse>

                    <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: "center" }}>
                        <Box sx={{ width: 64, height: 64, mx: "auto", mb: 2, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "primary.50", color: "primary.main" }}>
                            <Inventory2RoundedIcon sx={{ fontSize: 34 }} />
                        </Box>
                        <Typography variant="h5" fontWeight={850}>No order on this line</Typography>
                        <Typography color="text.secondary" mt={1} mb={3}>
                            Add the first order or style to start entering targets and hourly production.
                        </Typography>
                        <Stack direction="row" justifyContent="center" spacing={1}>
                            <IconButton onClick={openStyleSettings} aria-label="Style settings" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                                <SettingsRoundedIcon />
                            </IconButton>
                            <Button variant="contained" size="large" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}>
                                Add order
                            </Button>
                        </Stack>
                    </Paper>
                </Box>

                <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle fontWeight={800}>Add first order</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary" mb={2}>Select the style that will run on this production line.</Typography>
                        <Select fullWidth value={newStyleId} onChange={(event) => setNewStyleId(event.target.value)} displayEmpty>
                            <MenuItem value="" disabled>Select a style</MenuItem>
                            {styleData?.map((style) => (
                                <MenuItem key={style?.id} value={style?.id}>{style?.styleNo}</MenuItem>
                            ))}
                        </Select>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                        <Button variant="contained" disabled={!newStyleId || isCreatingOrder} onClick={handleAddOrder}>{isCreatingOrder ? "Creating…" : "Create order"}</Button>
                    </DialogActions>
                </Dialog>
                <StyleSettingsDialog
                    open={settingsOpen}
                    orders={lineData?.orders ?? []}
                    checkedStyles={checkedStyles}
                    onToggle={(id, checked) => setCheckedStyles((current) => ({ ...current, [id]: checked }))}
                    onClose={() => setSettingsOpen(false)}
                />
            </CardList>
        );
    }

    const today = activeOrder?.dailyRecords?.find((record) => record.isToday) ?? activeOrder?.dailyRecords?.at(-1);
    const todayOutput = sumHours(today);
    const defectTotal = sumHours(activeOrder?.defects);
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
                            <Typography variant="h4" color="white" fontWeight={850}>Line {lineData?.line ?? "—"}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={openStyleSettings} aria-label="Style settings" sx={{ bgcolor: "white", borderRadius: 2, "&:hover": { bgcolor: "grey.100" } }}>
                            <SettingsRoundedIcon />
                        </IconButton>
                        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 750 }}>Add order</Button>
                    </Stack>
                </Stack>

                <Paper elevation={0} sx={{ p: 1, mb: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,.96)" }}>
                    <Stack direction={{ xs: "column", md: "row" }} gap={1}>
                        {activeOrders.map((order) => {
                            const selected = order.id === activeOrderId;
                            const output = sumHours(order.dailyRecords?.find((record) => record.isToday));
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
                        const current = lineData?.orders?.find((order) => order.id === activeOrderId);
                        const todayRecord = current?.dailyRecords?.find((record) => record.isToday)
                            ?? current?.dailyRecords?.at(-1)
                            ?? {};
                        const saved = {
                            ...current,
                            ...values,
                            startDate: values.startDate?.format("YYYY-MM-DD") ?? null,
                            finishDate: values.finishDate?.format("YYYY-MM-DD") ?? null,
                        };
                        const payload = {
                            tvName,
                            tvOrderId: activeOrderId,
                            line: lineData?.line,
                            worker: Number(lineData?.worker) || 0,
                            helper: Number(lineData?.helper) || 0,
                            orderNo: saved.orderNo,
                            status: saved.status,
                            totalInLine: Number(saved.totalInLine) || 0,
                            balanceInLine: Number(saved.balanceInLine) || 0,
                            orderQty: Number(saved.orderQty) || 0,
                            totalOutput: Number(saved.totalOutput) || 0,
                            qcRepairBack: Number(saved.qcRepairBack) || 0,
                            startDate: saved.startDate,
                            finishDate: saved.finishDate,
                            orderInline: Number(saved.orderInline) || 0,
                            balanceDay: Number(saved.balanceDay) || 0,
                            wHour: Number(saved.wHour) || 0,
                            hTarg: Number(saved.hTarg) || 0,
                            input: Number(saved.input) || 0,
                            dTarg: Number(todayRecord.dTarg) || 0,
                            ...HOUR_KEYS.reduce((result, key) => ({
                                ...result,
                                [key]: Number(todayRecord[key]) || 0,
                                [`d${key}`]: Number(current?.defects?.[key]) || 0,
                            }), {}),
                        };

                        try {
                            await updateTvData(payload).unwrap();
                            updateActiveOrder(() => saved);
                            setNotice({ severity: "success", text: `${saved.orderNo} saved successfully.` });
                            await refetch();
                        } catch (error) {
                            setNotice({
                                severity: "error",
                                text: error?.data?.error?.description
                                    ?? error?.data?.message
                                    ?? `Unable to save ${saved.orderNo}.`,
                            });
                        } finally {
                            setSubmitting(false);
                        }
                    }}>
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                        <Form>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 330px" }, gap: 2 }}>
                                <Stack spacing={2} minWidth={0}>
                                    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3 }}>
                                        <Box mb={2}><Typography variant="h6" fontWeight={800}>Order details</Typography><Typography variant="body2" color="text.secondary">Identity, dates and production quantities for this style.</Typography></Box>
                                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2 }}>
                                            <TextField
                                                name="orderNo"
                                                label="Order No. / Style"
                                                value={values.orderNo ?? ""}
                                                disabled
                                                slotProps={{ htmlInput: { readOnly: true } }}
                                                error={touched.orderNo && Boolean(errors.orderNo)}
                                                helperText={touched.orderNo && errors.orderNo}
                                            />
                                            <DatePicker label="Start date" value={values.startDate} onChange={(value) => setFieldValue("startDate", value)} />
                                            <DatePicker label="Finish date" value={values.finishDate} minDate={values.startDate ?? undefined} onChange={(value) => setFieldValue("finishDate", value)} />
                                            <TextField select name="status" label="Production status" value={values.status ?? "ACTIVE"} onChange={handleChange}>
                                                <MenuItem value="ACTIVE">Active</MenuItem>
                                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                            </TextField>
                                            {[
                                                ["orderQty", "Order quantity"], ["totalInLine", "Total in line"], ["totalOutput", "Total output"], ["balanceInLine", "Balance in line"],
                                                ["orderInline", "Order in line"], ["qcRepairBack", "QC repair back"], ["input", "Input"], ["balanceDay", "Balance days", true],
                                            ].map(([key, label, disabled = false]) => <TextField key={key} type="number" name={key} label={label} value={values[key]} onChange={handleChange} onBlur={handleBlur} disabled={disabled} error={touched[key] && Boolean(errors[key])} helperText={touched[key] && errors[key]} />)}
                                        </Box>
                                    </Paper>

                                    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
                                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.5} p={{ xs: 2, md: 2.5 }} pb={1.5}>
                                            <Box><Typography variant="h6" fontWeight={800}>Hourly production</Typography><Typography variant="body2" color="text.secondary">Enter output per hour. Previous dates stay read-only.</Typography></Box>
                                            <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={handleAddDailyRecord} disabled={isCreatingTvData} sx={{ textTransform: "none", fontWeight: 750, whiteSpace: "nowrap" }}>{isCreatingTvData ? "Creating…" : "Add daily record"}</Button>
                                        </Stack>
                                        <Box sx={{ overflowX: "auto" }}>
                                            <Table size="small" sx={{ minWidth: 1120 }}>
                                                <TableHead><TableRow sx={{ bgcolor: "#f5f7fa" }}><TableCell>Date</TableCell><TableCell align="center">Daily target</TableCell>{HOUR_KEYS.map((key) => <TableCell key={key} align="center">{HOUR_LABELS[key]}</TableCell>)}<TableCell align="center">Total</TableCell><TableCell align="center">Rate</TableCell></TableRow></TableHead>
                                                <TableBody>
                                                    {activeOrder?.dailyRecords?.map((record) => {
                                                        const total = sumHours(record); const rate = Number(record.dTarg) ? Math.round(total / Number(record.dTarg) * 100) : 0;
                                                        return <TableRow key={record.id} sx={{ bgcolor: record.isToday ? "#f7faff" : "#fff" }}>
                                                            <TableCell><Stack direction="row" spacing={1} alignItems="center"><Typography fontWeight={700}>{dayjs(record.date).format("DD MMM")}</Typography>{record.isToday && <Chip label="Today" size="small" color="primary" />}</Stack></TableCell>
                                                            <TableCell align="center">{record.isToday && <Typography fontWeight={650}>{record.dTarg}</Typography>}</TableCell>
                                                            {HOUR_KEYS.map((key) => <TableCell key={key} align="center">{record.isToday && (record[key] ?? "—")}</TableCell>)}
                                                            <TableCell align="center"><Typography fontWeight={850}>{total}</Typography></TableCell><TableCell align="center"><Chip label={`${rate}%`} size="small" color={rate >= 90 ? "success" : rate >= 70 ? "warning" : "error"} /></TableCell>
                                                        </TableRow>;
                                                    })}
                                                    <TableRow sx={{ bgcolor: "#fffafa" }}><TableCell><Typography color="error.main" fontWeight={800}>Defects</Typography></TableCell><TableCell align="center">—</TableCell>{HOUR_KEYS.map((key) => <TableCell key={key} align="center"><NumberInput defect value={activeOrder?.defects?.[key]} onChange={(value) => updateHour(null, key, value, true)} /></TableCell>)}<TableCell align="center"><Typography color="error.main" fontWeight={850}>{defectTotal}</Typography></TableCell><TableCell align="center">—</TableCell></TableRow>
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Paper>
                                </Stack>

                                <Stack spacing={2} sx={{ alignSelf: "start", position: { xl: "sticky" }, top: { xl: 16 } }}>
                                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}>
                                        <Typography variant="h6" fontWeight={800}>Today at a glance</Typography><Typography variant="body2" color="text.secondary" mb={2}>{today?.date ? dayjs(today.date).format("dddd, DD MMMM") : "No daily record"}</Typography>
                                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
                                            <Metric label="Output" value={todayOutput} helper="pieces" tone="#2563eb" icon={<TrendingUpRoundedIcon fontSize="small" />} />
                                            <Metric label="Target" value={today?.dTarg || 0} helper="pieces" tone="#7c3aed" icon={<Inventory2RoundedIcon fontSize="small" />} />
                                            <Metric label="People" value={Number(lineData?.worker ?? 0) + Number(lineData?.helper ?? 0)} helper={`${lineData?.worker ?? 0} + ${lineData?.helper ?? 0}`} tone="#0891b2" icon={<Groups2RoundedIcon fontSize="small" />} />
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
                                                    value={lineData?.worker ?? ""}
                                                    onChange={(event) => setLineData((previous) => ({
                                                        ...previous,
                                                        worker: Math.max(Number(event.target.value), 0),
                                                    }))}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Helpers"
                                                    value={lineData?.helper ?? ""}
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
                <DialogTitle fontWeight={800}>Add another order</DialogTitle><DialogContent><Typography color="text.secondary" mb={2}>This creates a separate workspace with its own targets, output and defects.</Typography>
                <Select fullWidth value={newStyleId} onChange={(event) => setNewStyleId(event.target.value)} displayEmpty sx={{ mb: 2 }}>
                    <MenuItem value="" disabled>
                        Select a style
                    </MenuItem>
                    {styleData?.map((style) => (
                        <MenuItem key={style?.id} value={style?.id}>
                            {style?.styleNo}
                        </MenuItem>
                    ))}
                </Select>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}><Button onClick={() => setAddOpen(false)} disabled={isCreatingOrder}>Cancel</Button><Button variant="contained" disabled={!newStyleId || isCreatingOrder} onClick={handleAddOrder}>{isCreatingOrder ? "Creating…" : "Create order"}</Button></DialogActions>
            </Dialog>
            <StyleSettingsDialog
                open={settingsOpen}
                orders={lineData?.orders ?? []}
                checkedStyles={checkedStyles}
                onToggle={(id, checked) => setCheckedStyles((current) => ({ ...current, [id]: checked }))}
                onClose={() => setSettingsOpen(false)}
            />
        </CardList>
    );
}

export default TVLineInput;
