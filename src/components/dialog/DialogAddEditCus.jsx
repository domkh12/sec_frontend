import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
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

    const handleClose = () => {
        formikRef.current?.resetForm();
        onClose();
    };

    const renderField = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }, field) => {
        const commonProps = {
            key: field.name,
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
                        {...commonProps}
                        select
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[field.name]}
                    >
                        {field.options?.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                );

            case "autocomplete":
                return (
                    <Autocomplete
                        key={field.name}
                        options={field.options || []}
                        getOptionLabel={(opt) => opt.label ?? ""}
                        value={field.options?.find(o => o.value === values[field.name]) || null}
                        onChange={(_, selected) => setFieldValue(field.name, selected?.value ?? "")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                {...commonProps}
                                onBlur={handleBlur}
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