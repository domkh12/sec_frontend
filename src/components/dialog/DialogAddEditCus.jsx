import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, CircularProgress
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";

function DialogAddEditCus({
                              title,
                              isOpen = false,
                              onClose = false,
                              isUpdate = false,
                              validationSchema,
                              handleSubmit,
                              initialValues,
                              fields = []
                          }) {
    const { t } = useTranslation();
    const formikRef = useRef(null);
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [loadingFields, setLoadingFields] = useState({});

    useEffect(() => {
        if (!isOpen) return;
        fields.forEach((field) => {
            if (field.fetchOptions && typeof field.fetchOptions === "function") {
                setLoadingFields((prev) => ({ ...prev, [field.name]: true }));
                field.fetchOptions()
                    .then((options) => {
                        setDynamicOptions((prev) => ({ ...prev, [field.name]: options }));
                    })
                    .catch(() => {
                        setDynamicOptions((prev) => ({ ...prev, [field.name]: [] }));
                    })
                    .finally(() => {
                        setLoadingFields((prev) => ({ ...prev, [field.name]: false }));
                    });
            }
        });
    }, [isOpen]);

    const handleClose = () => {
        formikRef.current?.resetForm();
        onClose();
    };

    const glassInputSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.92)",
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
            "& fieldset": {
                borderColor: "rgba(255,255,255,0.18)",
                borderWidth: "1px",
            },
            "&:hover fieldset": {
                borderColor: "rgba(255,255,255,0.38)",
            },
            "&.Mui-focused": {
                backgroundColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 0 0 3px rgba(147,197,253,0.15), inset 0 1px 0 rgba(255,255,255,0.12)",
                "& fieldset": {
                    borderColor: "rgba(147,197,253,0.6)",
                    borderWidth: "1.5px",
                },
            },
            "&.Mui-error fieldset": {
                borderColor: "rgba(252,165,165,0.7)",
            },
        },
        "& .MuiInputLabel-root": {
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.875rem",
            "&.Mui-focused": { color: "rgba(147,197,253,0.9)" },
            "&.Mui-error": { color: "rgba(252,165,165,0.8)" },
        },
        "& .MuiFormHelperText-root": {
            color: "rgba(252,165,165,0.8)",
            fontSize: "0.72rem",
        },
        "& .MuiSelect-icon": { color: "rgba(255,255,255,0.45)" },
        "& .MuiMenuItem-root": { fontSize: "0.875rem" },
    };

    const renderField = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }, field) => {
        const resolvedOptions = dynamicOptions[field.name] ?? field.options ?? [];
        const isLoading = loadingFields[field.name] ?? false;

        const commonProps = {
            label: t(field.label),
            id: field.name,
            size: "small",
            fullWidth: true,
            error: !!(errors[field.name] && touched[field.name]),
            helperText: errors[field.name] && touched[field.name] ? errors[field.name] : null,
            sx: glassInputSx,
        };

        switch (field.type) {
            case "text":
            case "number":
            case "email":
                return (
                    <TextField
                        key={field.name}
                        {...commonProps}
                        type={field.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[field.name]}
                    />
                );

            case "select":
                return (
                    <TextField
                        key={field.name}
                        {...commonProps}
                        select
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[field.name]}
                        InputProps={{
                            endAdornment: isLoading ? <CircularProgress size={14} sx={{ mr: 2, color: "rgba(147,197,253,0.7)" }} /> : null,
                        }}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        background: "rgba(15,23,42,0.92)",
                                        backdropFilter: "blur(20px)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: "10px",
                                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                        "& .MuiMenuItem-root": {
                                            color: "#fff !important",
                                            fontSize: "0.875rem",
                                            "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
                                            "&.Mui-selected": {
                                                backgroundColor: "rgba(147,197,253,0.18)",
                                                color: "#fff !important",
                                            },
                                            "&.Mui-disabled": {
                                                color: "rgba(255,255,255,0.35) !important",
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        {resolvedOptions.length > 0 ? (
                            resolvedOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled value="">
                                {isLoading ? t("loading") : t("no.options")}
                            </MenuItem>
                        )}
                    </TextField>
                );

            case "autocomplete":
                return (
                    <Autocomplete
                        key={field.name}
                        options={resolvedOptions}
                        loading={isLoading}
                        getOptionLabel={(opt) => opt.label ?? ""}
                        value={resolvedOptions.find((o) => o.value === values[field.name]) || null}
                        onChange={(_, selected) => setFieldValue(field.name, selected?.value ?? "")}
                        componentsProps={{
                            paper: {
                                sx: {
                                    background: "rgba(15,23,42,0.92)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: "10px",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                    "& .MuiAutocomplete-option": {
                                        color: "#fff !important",
                                        fontSize: "0.875rem",
                                        '&[aria-selected="true"]': { backgroundColor: "rgba(147,197,253,0.18) !important" },
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.08) !important" },
                                    },
                                    "& .MuiAutocomplete-noOptions": {
                                        color: "rgba(255,255,255,0.45)",
                                        fontSize: "0.875rem",
                                    },
                                },
                            },
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                {...commonProps}
                                onBlur={handleBlur}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoading ? <CircularProgress size={14} sx={{ color: "rgba(147,197,253,0.7)" }} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                );

            case "date":
                return (
                    <DatePicker
                        key={field.name}
                        label={t(field.label)}
                        value={values[field.name]}
                        onChange={(date) => setFieldValue(field.name, date)}
                        slotProps={{
                            textField: {
                                id: field.name,
                                size: "small",
                                fullWidth: true,
                                onBlur: handleBlur,
                                error: !!(errors[field.name] && touched[field.name]),
                                helperText: errors[field.name] && touched[field.name] ? errors[field.name] : null,
                                sx: glassInputSx,
                            },
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            transitionDuration={{ enter: 280, exit: 150 }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(2,6,23,0.55)",
                        backdropFilter: "blur(6px)",
                    },
                },
            }}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "18px",
                    width: "420px",
                    padding: "6px",
                    background: "rgba(15,23,42,0.55)",
                    backdropFilter: "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.18),
                        inset 0 -1px 0 rgba(255,255,255,0.05),
                        0 32px 80px rgba(0,0,0,0.55),
                        0 8px 24px rgba(0,0,0,0.3)
                    `,
                    overflow: "hidden",
                    // subtle top highlight stripe
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "10%",
                        right: "10%",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                        borderRadius: "1px",
                    },
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: "0.01em",
                    pb: 0.5,
                    px: 2.5,
                    pt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&::before": {
                        content: '""',
                        display: "inline-block",
                        width: "3px",
                        height: "18px",
                        borderRadius: "2px",
                        background: "linear-gradient(180deg, rgba(147,197,253,0.9), rgba(99,179,237,0.5))",
                        flexShrink: 0,
                    },
                }}
            >
                {title}
            </DialogTitle>

            {/* Thin divider */}
            <div style={{
                margin: "10px 20px 0",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            }} />

            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {(formikProps) => (
                    <Form>
                        <DialogContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                pt: 2,
                                px: 2.5,
                                pb: 1.5,
                            }}
                        >
                            {fields.map((field) => renderField(formikProps, field))}
                        </DialogContent>

                        {/* Thin divider */}
                        <div style={{
                            margin: "0 20px 10px",
                            height: "1px",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                        }} />

                        <DialogActions sx={{ pb: 2, px: 2.5, gap: 1 }}>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderRadius: "9px",
                                    borderColor: "rgba(255,255,255,0.2)",
                                    color: "rgba(255,255,255,0.65)",
                                    fontSize: "0.8rem",
                                    fontWeight: 500,
                                    px: 2.5,
                                    textTransform: "none",
                                    backdropFilter: "blur(4px)",
                                    "&:hover": {
                                        borderColor: "rgba(255,255,255,0.38)",
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        color: "rgba(255,255,255,0.85)",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                size="small"
                                sx={{
                                    borderRadius: "9px",
                                    background: "linear-gradient(135deg, rgba(96,165,250,0.85) 0%, rgba(59,130,246,0.75) 100%)",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(147,197,253,0.3)",
                                    boxShadow: "0 4px 16px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                                    color: "rgba(255,255,255,0.95)",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    px: 2.5,
                                    textTransform: "none",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, rgba(96,165,250,0.95) 0%, rgba(59,130,246,0.9) 100%)",
                                        boxShadow: "0 6px 20px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
                                        transform: "translateY(-1px)",
                                    },
                                    transition: "all 0.18s ease",
                                }}
                            >
                                {isUpdate ? "Update" : "Create"}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default DialogAddEditCus;