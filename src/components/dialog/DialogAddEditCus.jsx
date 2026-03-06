import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";  // ✅ add useState, useEffect
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

    // ✅ These were missing entirely in your current file
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [loadingFields, setLoadingFields] = useState({});

    // ✅ Trigger fetchOptions for all fields when dialog opens
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

    const renderField = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }, field) => {
        // ✅ Merge dynamic options with static fallback
        const resolvedOptions = dynamicOptions[field.name] ?? field.options ?? [];
        const isLoading = loadingFields[field.name] ?? false;

        const commonProps = {
            label: t(field.label),
            id: field.name,
            size: "small",
            fullWidth: true,
            error: !!(errors[field.name] && touched[field.name]),
            helperText: errors[field.name] && touched[field.name] ? errors[field.name] : null,
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
                            endAdornment: isLoading ? <CircularProgress size={16} sx={{ mr: 2 }} /> : null,
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
                        options={resolvedOptions}  // ✅ was field.options || []
                        loading={isLoading}
                        getOptionLabel={(opt) => opt.label ?? ""}
                        value={resolvedOptions.find((o) => o.value === values[field.name]) || null}
                        onChange={(_, selected) => setFieldValue(field.name, selected?.value ?? "")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                {...commonProps}
                                onBlur={handleBlur}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoading ? <CircularProgress size={16} /> : null}
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
                            }
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
            transitionDuration={{ enter: 250, exit: 0 }}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "10px",
                    width: "400px",
                    padding: "10px",
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>

            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {(formikProps) => (
                    <Form>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                            {fields.map((field) => renderField(formikProps, field))}
                        </DialogContent>

                        <DialogActions sx={{ pb: 1, px: 2, gap: 1 }}>
                            <Button onClick={handleClose} variant="outlined">
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
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