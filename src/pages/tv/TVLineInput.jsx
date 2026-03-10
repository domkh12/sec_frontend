import { useState, useCallback, useEffect } from "react";
import {
    Box, Paper, Typography, TextField, Button,
    Table, TableHead, TableBody, TableRow, TableCell,
    Chip, Divider, Stack, Grid, Alert, Collapse, Card,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SaveIcon from "@mui/icons-material/Save";
import TodayIcon from "@mui/icons-material/Today";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TopBar from "../../components/ui/TopBar.jsx";
import {
    useCreateTvDataMutation,
    useGetTvDataQuery,
    useUpdateTvDataMutation
} from "../../redux/feature/tv/tvApiSlice.js";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import {useNavigate, useParams} from "react-router-dom";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import AddIcon from '@mui/icons-material/Add';
import BackButton from "../../components/ui/BackButton.jsx";
import CardList from "../../components/ui/CardList.jsx";

const HOUR_KEYS   = ["h8","h9","h10","h11","h13","h14","h15","h16","h17","h18"];
const HOUR_LABELS = { h8:"8:00", h9:"9:00", h10:"10:00", h11:"11:00", h13:"13:00", h14:"14:00", h15:"15:00", h16:"16:00", h17:"17:00", h18:"18:00" };

// ─── helpers ────────────────────────────────────────────────────────────────

/** Map API dailyRecords + defects → internal row format */
function mapApiToRows(tvData) {
    if (!tvData) return [];
    const rows = (tvData.dailyRecords ?? []).map(rec => ({
        date:    rec.date,
        dTarg:   String(rec.dTarg ?? ""),
        isToday: !!rec.isToday,
        ...HOUR_KEYS.reduce((acc, k) => ({ ...acc, [k]: rec[k] != null ? String(rec[k]) : "" }), {}),
    }));

    // Append defect row
    if (tvData.defects) {
        rows.push({
            date:    "Defect",
            dTarg:   "",
            isDefect: true,
            ...HOUR_KEYS.reduce((acc, k) => ({
                ...acc,
                [k]: tvData.defects[k] != null ? String(tvData.defects[k]) : "",
            }), {}),
        });
    }
    return rows;
}

/** Map API response → Formik initialValues */
function mapApiToFormValues(tvData) {
    if (!tvData) return null;
    return {
        line:          tvData.line          ?? "",
        worker:        tvData.worker        != null ? String(tvData.worker) : "",
        orderNo:       tvData.orderNo       ?? "",
        totalInLine:   tvData.totalInLine   != null ? String(tvData.totalInLine)   : "",
        balanceInLine: tvData.balanceInLine != null ? String(tvData.balanceInLine) : "",
        orderQty:      tvData.orderQty      != null ? String(tvData.orderQty)      : "",
        totalOutput:   tvData.totalOutput   != null ? String(tvData.totalOutput)   : "",
        qcRepairBack:  tvData.qcRepairBack  != null ? String(tvData.qcRepairBack)  : "",
        startDate:     tvData.startDate     ? dayjs(tvData.startDate) : null,
        finishDate:    tvData.finishDate    ? dayjs(tvData.finishDate) : null,
        orderInline:   tvData.orderInline   ?? "",
        balanceDay:    tvData.balanceDay    != null ? String(tvData.balanceDay)    : "",
        wHour:         tvData.wHour         != null ? String(tvData.wHour)         : "",
        dTarg:         tvData.dailyRecords?.[0]?.dTarg != null ? String(tvData.dailyRecords[0].dTarg) : "",
        hTarg:         tvData.hTarg         != null ? String(tvData.hTarg)         : "",
        input:         tvData.input         != null ? String(tvData.input)         : "",
    };
}

function calcRow(row, baseTotal = null) {
    const total = HOUR_KEYS.reduce((s, k) => s + (Number(row[k]) || 0), 0);
    if (row.isDefect) {
        const rateValue = baseTotal > 0 ? Math.round((total / baseTotal) * 100) : 0;
        return { total, rateValue, rate: `${rateValue}%` };
    }
    const dTarg = Number(row.dTarg) || 0;
    const rateValue = dTarg > 0 ? Math.round((total / dTarg) * 100) : 0;
    return { total, rateValue, rate: `${rateValue}%` };
}

function getRateColor(v) {
    if (v >= 90) return "primary";
    if (v >= 70) return "success";
    if (v >= 50) return "warning";
    return "error";
}

function getRateHex(v) {
    if (v >= 90) return "#1565c0";
    if (v >= 70) return "#2e7d32";
    if (v >= 50) return "#f9a825";
    return "#c62828";
}

// ─── sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ icon, title, color = "primary.main" }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Box sx={{ color, display: "flex" }}>{icon}</Box>
            <Typography variant="subtitle2" fontWeight={700} letterSpacing={1} color={color} textTransform="uppercase">
                {title}
            </Typography>
        </Stack>
    );
}

function CalcField({ label, value, color = "primary" }) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={1} textTransform="uppercase">
                {label}
            </Typography>
            <Chip
                label={value}
                color={color}
                variant="outlined"
                sx={{ fontSize: 18, fontWeight: 900, minWidth: 80, height: 38, "& .MuiChip-label": { px: 2 } }}
            />
        </Box>
    );
}

function NumField({ value, onChange, highlight = false, defect = false }) {
    const bgColor     = defect ? "#fff5f5" : highlight ? "#fff8e1" : "#fff";
    const borderColor = defect ? "#c62828" : highlight ? "#f9a825" : undefined;
    const hoverColor  = defect ? "#b71c1c" : highlight ? "#f57c00" : undefined;
    return (
        <TextField
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            inputProps={{ style: { textAlign: "center", fontWeight: 700, fontSize: 14, padding: "5px 4px", color: defect ? "#c62828" : undefined } }}
            sx={{
                width: 76,
                "& .MuiOutlinedInput-root": {
                    backgroundColor: bgColor,
                    "& fieldset": { borderColor },
                    "&:hover fieldset": { borderColor: hoverColor },
                },
                "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": { display: "none" },
                "& input[type=number]": { MozAppearance: "textfield" },
            }}
        />
    );
}

// ─── validation schema ───────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
    line:          Yup.string().required("Line is required"),
    worker:        Yup.number().typeError("Must be a number").required("Worker count is required").min(1, "Must be at least 1"),
    orderNo:       Yup.string().required("Order No. is required"),
    totalInLine:   Yup.number().typeError("Must be a number").required("Total In Line is required").min(0),
    balanceInLine: Yup.number().typeError("Must be a number").required("Balance In Line is required").min(0),
    orderQty:      Yup.number().typeError("Must be a number").required("Order Qty is required").min(0),
    totalOutput:   Yup.number().typeError("Must be a number").required("Total Output is required").min(0),
    qcRepairBack:  Yup.number().typeError("Must be a number").min(0),
    startDate:     Yup.mixed().nullable(),
    finishDate:    Yup.mixed().nullable(),
    orderInline:   Yup.string(),
    balanceDay:    Yup.number().typeError("Must be a number").min(0),
    wHour:         Yup.number().typeError("Must be a number").required("Working hours required").min(1).max(24),
    hTarg:         Yup.number().typeError("Must be a number").required("Hourly target is required").min(0),
    input:         Yup.number().typeError("Must be a number").min(0),
    dTarg:         Yup.number().typeError("Must be a number").min(0),
});

// ─── main component ──────────────────────────────────────────────────────────

function TVLineInput() {
    const { name } = useParams();
    const { data: tvData, isLoading, refetch } = useGetTvDataQuery({ name }, { pollingInterval: 300000 });
    const [updateTvData] = useUpdateTvDataMutation();
    const [createTvData] = useCreateTvDataMutation();
    const [saveError, setSaveError] = useState(null);
    const { t } = useTranslation();
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const {
        messages,
        loading,
        connectionState,
        isConnected
    } = useWebsocketServer(`/topic/messages/tv-data-update`);

    // ─── WebSocket refetch ────────────────────────────────────────────────────
    useEffect(() => {
        if (messages.isUpdate === true) {
            refetch();
        }
    }, [messages]);

    // Rows are separate state (not Formik) because they are a dynamic table
    const [rows, setRows] = useState([]);

    // Sync rows when API data arrives
    useEffect(() => {
        if (tvData) {
            setRows(mapApiToRows(tvData));
        }
    }, [tvData]);

    const updateRow = useCallback(
        (ri, k, v) => setRows(p => p.map((r, i) => i === ri ? { ...r, [k]: v } : r)),
        []
    );

    // ── computed values ──
    const todayRow       = rows.find(r => r.isToday) ?? null;
    const todayQty       = todayRow ? calcRow(todayRow).total : 0;

    // ── submit handler ──
    const handleSubmit = async (values) => {
        const todayRec = rows.find(r => r.isToday) ?? {};
        const defectRec = rows.find(r => r.isDefect) ?? {};

        const payload = {
            tvName:        name,
            line:          values.line,
            worker:        Number(values.worker),
            orderNo:       values.orderNo,
            totalInLine:   Number(values.totalInLine),
            balanceInLine: Number(values.balanceInLine),
            orderQty:      Number(values.orderQty),
            totalOutput:   Number(values.totalOutput),
            qcRepairBack:  Number(values.qcRepairBack) || 0,
            startDate:     values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
            finishDate:    values.finishDate ? values.finishDate.format("YYYY-MM-DD") : null,
            orderInline:   values.orderInline,
            balanceDay:    Number(values.balanceDay) || 0,
            wHour:         Number(values.wHour),
            hTarg:         Number(values.hTarg),
            input:         Number(values.input) || 0,
            // today's daily target
            dTarg:         Number(todayRec.dTarg) || Number(values.dTarg) || 0,
            // hourly outputs for today
            ...HOUR_KEYS.reduce((acc, k) => ({ ...acc, [k]: Number(todayRec[k]) || 0 }), {}),
            // defects
            ...HOUR_KEYS.reduce((acc, k) => ({ ...acc, [`d${k}`]: Number(defectRec[k]) || 0 }), {}),
        };

        try {
            await updateTvData(payload).unwrap();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving TV data:", error);
            setSaveError(error?.data?.error?.description || "Failed to save data. Please try again.");
        }
    };

    const handleCreateTvData = async (values) => {
        try {
            await createTvData({name}).unwrap();
        }catch (error) {
            console.error("Error create TV data:", error);
            setSaveError(error?.data?.error?.description || "Failed to save data. Please try again.");
        }
    }

    const noSpinSx = {
        "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": { display: "none" },
        "& input[type=number]": { MozAppearance: "textfield" },
    };

    // sewStyle removed; startDate & finishDate handled separately as DatePickers
    const orderFields = [
        { key:"orderNo",       label:"Order No.",       type:"text"   },
        { key:"totalInLine",   label:"Total In Line",   type:"number" },
        { key:"balanceInLine", label:"Balance In Line", type:"number" },
        { key:"orderQty",      label:"Order Qty",       type:"number" },
        { key:"totalOutput",   label:"Total Output",    type:"number" },
        { key:"qcRepairBack",  label:"QC Repair Back",  type:"number" },
        { key:"orderInline",   label:"Order Inline",    type:"text"   },
        { key:"balanceDay",    label:"Balance Day",     type:"number" },
    ];

    if (isLoading || !tvData) {
        return <Typography sx={{ p: 4 }}>Loading...</Typography>;
    }

    const initialValues = mapApiToFormValues(tvData);

    return (
        <CardList>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize   // re-populate when tvData changes (e.g. after poll)
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, handleChange, handleBlur, setFieldValue }) => {
                    const hTarg          = Number(values.hTarg) || 0;
                    const completedHours = todayRow
                        ? HOUR_KEYS.filter(k => Number(todayRow[k]) > 0).length
                        : 0;
                    const nowTarCalc = completedHours * hTarg;
                    const difQty     = todayQty - nowTarCalc;

                    return (
                        <Form className="pb-8">
                            <div>
                                <Box maxWidth={1280} mx="auto">
                                    <BackButton onClick={() => navigate("/manager/tv-menu")}/>
                                    {/* Page title */}
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                                        <Box>
                                            <Typography variant="caption" color="white" letterSpacing={3} display="block">
                                                PRODUCTION MANAGEMENT
                                            </Typography>
                                            <Typography variant="h5" fontWeight={900} color="primary.main" letterSpacing={1}>
                                                LINE {values.line}&nbsp;
                                                <Box component="span" color="error.main">INPUT</Box>
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* SECTION 1 — Order Information */}
                                    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                        <SectionHeader icon={<AssignmentIcon />} title="Order Information" color="success.main" />
                                            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {orderFields.map(({ key, label, type }) => (
                                                    <TextField
                                                        fullWidth
                                                        name={key}
                                                        label={label}
                                                        type={type}
                                                        size="small"
                                                        value={values[key]}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={errors[key] && touched[key]}
                                                        helperText={
                                                            errors[key] && touched[key] ? errors[key] : null
                                                        }
                                                        inputProps={{ style: { fontWeight: 700 } }}
                                                        sx={type === "number" ? noSpinSx : {}}
                                                    />
                                            ))}

                                            {/* Start Date */}
                                                <DatePicker
                                                    label="Start Date"
                                                    value={values.startDate}
                                                    onChange={(val) => setFieldValue("startDate", val)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            size: "small",
                                                            error: !!(errors.startDate && touched.startDate),
                                                            helperText: errors.startDate && touched.startDate ? errors.startDate : null,
                                                            inputProps: { style: { fontWeight: 700 } },
                                                        },
                                                    }}
                                                />

                                            {/* Finish Date */}
                                                <DatePicker
                                                    label="Finish Date"
                                                    value={values.finishDate}
                                                    onChange={(val) => setFieldValue("finishDate", val)}
                                                    minDate={values.startDate ?? undefined}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            size: "small",
                                                            error: !!(errors.finishDate && touched.finishDate),
                                                            helperText: errors.finishDate && touched.finishDate ? errors.finishDate : null,
                                                            inputProps: { style: { fontWeight: 700 } },
                                                        },
                                                    }}
                                                />
                                            </div>
                                    </Paper>

                                    {/* SECTION 2 — Target Settings */}
                                    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                        <SectionHeader icon={<AccessTimeIcon />} title="Target Settings" color="primary.main" />
                                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Line & Worker */}
                                            {[
                                                { key:"line",   label:"Line",   hint:"Line number"  },
                                                { key:"worker", label:"Worker", hint:"Worker count" },
                                            ].map(({ key, label, hint }) => (
                                                <Box key={key} display="flex" flexDirection="column" gap={0.5}>
                                                    <TextField
                                                        name={key}
                                                        label={label}
                                                        size="small"
                                                        value={values[key]}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={errors[key] && touched[key]}
                                                        helperText={
                                                            errors[key] && touched[key] ? errors[key] : null
                                                        }
                                                        inputProps={{ style: { fontWeight: 700 } }}
                                                    />
                                                    <Typography variant="caption" color="text.disabled">{hint}</Typography>
                                                </Box>
                                            ))}

                                            {/* Numeric target fields */}
                                            {[
                                                { key:"wHour", label:"W.Hour", hint:"Working hours" },
                                                { key:"hTarg", label:"H.Targ", hint:"Hourly target" },
                                                { key:"input", label:"Input",  hint:"Input count"   },
                                            ].map(({ key, label, hint }) => (
                                                <Box key={key} display="flex" flexDirection="column" gap={0.5}>
                                                    <TextField
                                                        name={key}
                                                        label={label}
                                                        type="number"
                                                        size="small"
                                                        value={values[key]}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={errors[key] && touched[key]}
                                                        helperText={
                                                            errors[key] && touched[key] ? errors[key] : null
                                                        }
                                                        sx={{...noSpinSx }}
                                                    />
                                                    <Typography variant="caption" color="text.disabled">{hint}</Typography>
                                                </Box>
                                            ))}
                                            <div></div>
                                            <CalcField label="Today Qty" value={todayQty} color="primary" />
                                            <CalcField label="Now.Tar"   value={nowTarCalc} color="primary" />
                                            <CalcField label="Dif Qty"   value={difQty} color={difQty < 0 ? "error" : "success"} />
                                        </div>
                                    </Paper>

                                    {/* SECTION 3 — Hourly Data */}
                                    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                        <SectionHeader icon={<TodayIcon />} title="Hourly Data" color="warning.dark" />
                                        <Box sx={{ overflowX: "auto" }}>
                                            <Table size="small" sx={{ minWidth: 1000 }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Date</TableCell>
                                                        <TableCell align="center" sx={{ backgroundColor: "#0d47a1 !important" }}>D.Targ</TableCell>
                                                        {HOUR_KEYS.map(k => (
                                                            <TableCell key={k} align="center">{HOUR_LABELS[k]}</TableCell>
                                                        ))}
                                                        <TableCell align="center" sx={{ backgroundColor: "#0d47a1 !important" }}>Total</TableCell>
                                                        <TableCell align="center" sx={{ backgroundColor: "#0d47a1 !important" }}>Rate%</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {rows.map((row, ri) => {
                                                        const { total, rateValue, rate } = calcRow(row, todayQty);
                                                        const isToday  = !!row.isToday;
                                                        const isDefect = !!row.isDefect;
                                                        const rowBg    = isToday ? "#e3f2fd" : isDefect ? "#fff8f8" : "#fafafa";

                                                        return (
                                                            <TableRow key={ri} sx={{ backgroundColor: rowBg, "&:hover": { filter: "brightness(0.97)" } }}>

                                                                {/* Date */}
                                                                <TableCell align="center">
                                                                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                                                                        <Typography fontWeight={700} color={isToday ? "primary.main" : "text.secondary"} fontSize={14}>
                                                                            {row.date}
                                                                        </Typography>
                                                                        {isToday && <Chip label="TODAY" size="small" color="primary" sx={{ fontSize: 10, height: 18 }} />}
                                                                    </Stack>
                                                                </TableCell>

                                                                {/* D.Targ */}
                                                                <TableCell align="center" sx={{ backgroundColor: isToday ? "#bbdefb" : isDefect ? "#fff8f8" : "#f5f5f5" }}>
                                                                    {isDefect ? (
                                                                        <Typography color="text.disabled">—</Typography>
                                                                    ) : isToday ? (
                                                                        <NumField value={row.dTarg} onChange={(v) => updateRow(ri, "dTarg", v)} highlight />
                                                                    ) : (
                                                                        <Typography fontWeight={700} color="text.secondary" fontSize={14}>{row.dTarg || "—"}</Typography>
                                                                    )}
                                                                </TableCell>

                                                                {/* Hour slots */}
                                                                {HOUR_KEYS.map(k => (
                                                                    <TableCell key={k} align="center">
                                                                        {(isToday || isDefect) ? (
                                                                            <NumField
                                                                                value={row[k]}
                                                                                onChange={(v) => updateRow(ri, k, v)}
                                                                                highlight={Number(row[k]) > 0}
                                                                                defect={isDefect}
                                                                            />
                                                                        ) : (
                                                                            <Typography fontWeight={700} fontSize={14} color="text.primary">
                                                                                {row[k] || "—"}
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>
                                                                ))}

                                                                {/* Total */}
                                                                <TableCell align="center" sx={{ backgroundColor: isToday ? "#bbdefb" : "#f5f5f5" }}>
                                                                    <Typography fontWeight={900} color="primary.main" fontSize={15}>{total || "—"}</Typography>
                                                                </TableCell>

                                                                {/* Rate% */}
                                                                <TableCell align="center" sx={{ position: "relative", overflow: "hidden", minWidth: 80, backgroundColor: isToday ? "#bbdefb" : "#f5f5f5" }}>
                                                                    {!isDefect && (
                                                                        <Box sx={{
                                                                            position: "absolute", top: 0, left: 0,
                                                                            height: "100%", width: `${Math.min(rateValue, 100)}%`,
                                                                            backgroundColor: getRateHex(rateValue),
                                                                            opacity: 0.15, transition: "width 0.4s ease",
                                                                        }} />
                                                                    )}
                                                                    <Chip
                                                                        label={rate}
                                                                        size="small"
                                                                        color={getRateColor(rateValue)}
                                                                        variant={isDefect ? "outlined" : "filled"}
                                                                        sx={{ fontWeight: 900, fontSize: 13, position: "relative" }}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Paper>

                                    {/* Success Alert */}
                                    <Collapse in={showSuccess}>
                                        <Alert
                                            severity="success"
                                            onClose={() => setShowSuccess(false)}
                                            sx={{ mb: 2, fontWeight: 600 }}
                                        >
                                            Data saved successfully!
                                        </Alert>
                                    </Collapse>

                                    <Collapse in={!!saveError}>
                                        <Alert
                                            severity="error"
                                            onClose={() => setSaveError(null)}
                                            sx={{ mb: 2, fontWeight: 600 }}
                                        >
                                            {saveError}
                                        </Alert>
                                    </Collapse>

                                    {/* Actions */}
                                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            sx={{ fontWeight: 700, color: "white", borderColor: "white" }}
                                            onClick={handleCreateTvData}
                                        >
                                            Create new row
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SaveIcon />}
                                            type="submit"
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Save Data
                                        </Button>
                                    </Stack>

                                </Box>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </LocalizationProvider>
        </CardList>
    );
}

export default TVLineInput;