import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { t } from "i18next";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {Button, Stack, Typography, Box, Avatar, Divider, TextField, Snackbar, Alert} from "@mui/material";
import CardList from "../../components/ui/CardList.jsx";
import CardGlassBlur2 from "../../components/ui/CardGlassBlur2.jsx";
import InputFileUpload from "../../components/ui/InputFileUpload.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import {useUpdateUserProfileMutation } from "../../redux/feature/auth/authApiSlice.js";
import {setAlertProfile, setIsOpenSnackbarProfile} from "../../redux/feature/auth/authSlice.js";
import {setAlertDept} from "../../redux/feature/department/departmentSlice.js";

// ── Validation Schema ──────────────────────────────────────────────────────────
const validationSchema = Yup.object({
    firstName: Yup.string().required(t("validation.required")),
    lastName:  Yup.string().required(t("validation.required")),
    phone:     Yup.string().matches(/^\+?[0-9\s\-()]{7,20}$/, t("validation.invalidPhone")),
    birthday: Yup.mixed()
        .nullable()
        .test("valid-date", t("validation.invalidDate"), (val) =>
            val === null || dayjs(val).isValid()
        ),
});

// ── Shared MUI TextField style ─────────────────────────────────────────────────
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
        "&:hover fieldset": { borderColor: "rgba(6,182,212,0.4)" },
        "&.Mui-focused fieldset": { borderColor: "rgba(6,182,212,0.6)" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)", fontSize: 12 },
    "& .MuiInputLabel-root.Mui-focused": { color: "rgb(6,182,212)" },
    "& .MuiOutlinedInput-input": { color: "#e2e8f0", fontSize: 14 },
    "& .MuiFormHelperText-root": { color: "#f87171" },
};

// ── Component ──────────────────────────────────────────────────────────────────
function Profile() {
    const user     = useSelector((state) => state.auth.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isOpenSnackbar = useSelector((state) => state.auth.isOpenSnackbarProfile);
    const alertProfile = useSelector((state) => state.auth.alert);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const initialValues = {
        firstName: user.firstName   ?? "",
        lastName:  user.lastName    ?? "",
        phone:     user.phoneNumber ?? "",
        birthday:  user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
    };

    const handleSubmit = async (values) => {
        try {
            await updateProfile({
                firstName:   values.firstName,
                lastName:    values.lastName,
                phoneNumber: values.phone,
                dateOfBirth: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,  // format before sending
            }).unwrap();
            dispatch(setAlertProfile({type: "success", message: "Update successfully"}));
            dispatch(setIsOpenSnackbarProfile(true));
        } catch (err) {
            console.error("Error updating profile:", err);
            dispatch(setAlertProfile({type: "error", message: err.data.error.description}));
            dispatch(setIsOpenSnackbarProfile(true));
        }
    };

    return (
        <>
        <CardList>
            <BackButton onClick={() => navigate("/admin")} />

            {/* ── 1. Identity Card ─────────────────────────────────────────────── */}
            <CardGlassBlur2>
                {/* Role badge */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Typography
                        sx={{
                            fontSize: 10, fontWeight: 700, letterSpacing: 2,
                            textTransform: "uppercase", color: "#a5f3fc",
                            border: "1px solid rgba(6,182,212,0.4)",
                            background: "rgba(8,145,178,0.2)",
                            borderRadius: "999px", px: 1.5, py: 0.5,
                        }}
                    >
                        {user.role}
                    </Typography>
                </Box>

                {/* Avatar + name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ position: "relative" }}>
                        <Box sx={{
                            p: "3px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                            boxShadow: "0 0 20px rgba(6,182,212,0.45)",
                        }}>
                            <Avatar src={user.avatar} alt={user.username} sx={{ width: 64, height: 64, border: "3px solid #0f172a" }} />
                        </Box>
                        {/* Online dot */}
                        <Box sx={{
                            position: "absolute", bottom: 2, right: 2,
                            width: 12, height: 12, borderRadius: "50%",
                            bgcolor: "#34d399", border: "2px solid #0f172a",
                            boxShadow: "0 0 8px #34d399",
                        }} />
                    </Box>

                    <Box>
                        <Typography sx={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>

                {/* Quick stats */}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1.5, mt: 3 }}>
                    {[
                        { label: "User ID",  value: `#${user.id}` },
                        { label: "Phone",    value: user.phoneNumber ? `+${user.phoneNumber}` : "—" },
                        { label: "Birthday", value: user.dateOfBirth ?? "—" },
                    ].map(({ label, value }) => (
                        <Box key={label} sx={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "12px", px: 1.5, py: 1.5, textAlign: "center",
                        }}>
                            <Typography sx={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", mb: 0.5 }}>
                                {label}
                            </Typography>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#f1f5f9" }} noWrap>
                                {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardGlassBlur2>

            {/* ── 2. Photo Upload Card ─────────────────────────────────────────── */}
            <CardGlassBlur2>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", mb: 2 }}>
                    Profile Photo
                </Typography>

                <Box sx={{
                    display: "flex", alignItems: "center", gap: 2,
                    border: "1px dashed rgba(6,182,212,0.25)",
                    borderRadius: "12px", p: 2, background: "rgba(255,255,255,0.02)",
                }}>
                    <Avatar src={user.avatar} variant="rounded" sx={{ width: 52, height: 52, border: "1px solid rgba(255,255,255,0.1)" }} />

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500 }}>Change picture</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 11, mt: 0.3 }}>JPG or PNG · max 5 MB</Typography>
                    </Box>

                    <Stack spacing={1}>
                        <InputFileUpload />
                        <Button
                            size="small"
                            sx={{
                                fontSize: 11, fontWeight: 600, color: "#f87171",
                                border: "1px solid rgba(248,113,113,0.5)", borderRadius: "8px",
                                "&:hover": { background: "rgba(239,68,68,0.15)", borderColor: "#f87171" },
                            }}
                        >
                            Remove
                        </Button>
                    </Stack>
                </Box>
            </CardGlassBlur2>

            {/* ── 3. Edit Profile Card ─────────────────────────────────────────── */}
            <CardGlassBlur2>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", mb: 3 }}>
                    Edit Profile
                </Typography>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <Stack spacing={2.5}>
                                {/* First Name / Last Name */}
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                    <TextField
                                        name="firstName"
                                        label="First Name"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.firstName && Boolean(errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                        sx={fieldSx}
                                    />
                                    <TextField
                                        name="lastName"
                                        label="Last Name"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.lastName && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={fieldSx}
                                    />
                                </Box>

                                {/* Phone */}
                                <TextField
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="+1 234 567 890"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                    sx={fieldSx}
                                />

                                {/* Birthday */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Birthday"
                                        value={values.birthday}
                                        onChange={(val) => setFieldValue("birthday", val)}
                                        disableFuture
                                        slotProps={{
                                            textField: {
                                                onBlur: () => handleBlur({ target: { name: "birthday" } }),
                                                error: touched.birthday && Boolean(errors.birthday),
                                                helperText: touched.birthday && errors.birthday,
                                                sx: fieldSx,
                                                fullWidth: true,
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Stack>

                            <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 3 }} />

                            <Button
                                type="submit"
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    py: 1.5, borderRadius: "12px", fontWeight: 700,
                                    fontSize: 14, letterSpacing: 1, textTransform: "none",
                                    background: "linear-gradient(90deg, #06b6d4, #6366f1)",
                                    color: "#fff",
                                    boxShadow: "0 4px 20px rgba(6,182,212,0.3)",
                                    "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
                                    "&:active": { transform: "translateY(0)" },
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {isLoading ? "Saving…" : "Save Changes"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </CardGlassBlur2>
        </CardList>
        <Snackbar
            open={isOpenSnackbar}
            autoHideDuration={6000}
            onClose={() => dispatch(setIsOpenSnackbarProfile(false))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={() => dispatch(setIsOpenSnackbarProfile(false))}
                severity={alertProfile.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertProfile.message}
            </Alert>
        </Snackbar>
        </>
    );
}

export default Profile;