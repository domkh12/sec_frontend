import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, CircularProgress, GlobalStyles, FormControl, InputLabel, Select, IconButton, Tooltip
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import {useRef, useState, useEffect, useMemo, memo} from "react";
import { DatePicker } from "@mui/x-date-pickers";
import PasswordField from "../ui/PasswordField.jsx";
import NestedSelect from "../util/NestedSelect.jsx";
import {CheckBox, CheckBoxOutlineBlank} from "@mui/icons-material";
import VisuallyHiddenInput from "../input/VisuallyHiddenInput.jsx";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

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

// Shared dialog paper / backdrop styles (reused for nested dialog too)
const dialogPaperSx = {
    "& .MuiDialog-paper": {
        borderRadius: "18px",
        width: "min(680px, 95vw)",
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
};

const dialogTitleSx = {
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
};

const dividerStyle = {
    margin: "10px 20px 0",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
};

const bottomDividerStyle = {
    margin: "0 20px 10px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
};

function DialogAddEditCus({
                              title,
                              isOpen = false,
                              onClose = false,
                              isUpdate = false,
                              validationSchema,
                              handleSubmit,
                              initialValues,
                              fields = [],
                              isSubmitting = false,
                          }) {
    const { t } = useTranslation();
    const formikRef = useRef(null);
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [loadingFields, setLoadingFields] = useState({});
    console.log("dynamicOptions", dynamicOptions);
    // Nested "Add New" dialog state
    const [addNewDialog, setAddNewDialog] = useState({
        open: false,
        field: null,         // the parent field config that triggered this
    });

    const requiredFields = useMemo(() => {
        if (!validationSchema) return {};
        const result = {};
        Object.keys(validationSchema.fields ?? {}).forEach((key) => {
            const tests = validationSchema.fields[key]?.tests ?? [];
            result[key] = tests.some((t) => t.OPTIONS?.name === "required");
        });
        return result;
    }, [validationSchema]);

    const fetchFieldOptions = (fieldList) => {
        fieldList.forEach((field) => {
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
    };

    useEffect(() => {
        if (!isOpen) return;
        fetchFieldOptions(fields);
    }, [isOpen, fields]);

    const handleClose = () => {
        formikRef.current?.resetForm();
        onClose();
    };

    // Called when the nested "Add New" dialog successfully submits
    const handleAddNewSubmit = async (values, formikHelpers) => {
        const field = addNewDialog.field;
        if (!field?.addNew?.onSubmit) return;

        await field.addNew.onSubmit(values, formikHelpers);

        // Re-fetch options for the parent field so the new item appears
        if (field.fetchOptions) {
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

        setAddNewDialog({ open: false, field: null });
    };

    const renderField = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }, field) => {
        const resolvedOptions = dynamicOptions[field.name] ?? field.options ?? [];
        const isLoading = loadingFields[field.name] ?? false;
        const isRequired = requiredFields[field.name] ?? false;
        const commonProps = {
            label: isRequired ? (
                <span>
                    {t(field.label)}
                    <span style={{ color: "rgba(252,100,100,0.9)", marginLeft: "3px" }}>*</span>
                </span>
            ) : t(field.label),
            id: field.name,
            size: "small",
            fullWidth: true,
            error: !!(errors[field.name] && touched[field.name]),
            helperText: errors[field.name] && touched[field.name] ? errors[field.name] : null,
            sx: glassInputSx,
        };
        // "+ Add new …" link rendered below the field when addNew config exists
        const addNewLink = field.addNew ? (
            <button
                type="button"
                onClick={() => setAddNewDialog({ open: true, field })}
                style={{
                    background: "none",
                    border: "none",
                    padding: "2px 0 0 2px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "rgba(147,197,253,0.8)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    transition: "color 0.15s ease",
                    lineHeight: 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(147,197,253,1)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(147,197,253,0.8)")}
            >
                {/* Plus icon */}
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5.5" cy="5.5" r="5" stroke="currentColor" strokeWidth="1" />
                    <path d="M5.5 3v5M3 5.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {field.addNew.label ?? t("addNew")}
            </button>
        ) : null;

        // Wrapper so each field + its "add new" link sit in a small column
        const wrap = (node) => (
            <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {node}
                {addNewLink}
            </div>
        );

        const stepOptions = field.options ?? [];
        const stepValues = values[field.name] ?? [];

        const addStep = () => {
            setFieldValue(field.name, [
                ...stepValues,
                { _key: Date.now(), id: "", index: stepValues.length + 1 },
            ]);
        };

        const removeStep = (_key) => {
            const filtered = stepValues.filter((s) => s._key !== _key);
            // Re-number indexes after removal
            setFieldValue(
                field.name,
                filtered.map((s, i) => ({ ...s, index: i + 1 }))
            );
        };

        const updateStep = (index, id) => {
            setFieldValue(
                field.name,
                stepValues.map((s) => (s.index === index ? { ...s, id } : s))
            );
        };

        switch (field.type) {
            case "text":
            case "number":
            case "email":
                return wrap(
                    <TextField
                        {...commonProps}
                        type={field.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[field.name]}
                    />
                );
            case "password":
                return wrap(
                    <PasswordField
                        {...commonProps}
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                );
            case "select":
                return wrap(
                    <TextField
                        {...commonProps}
                        select
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[field.name]}
                        InputProps={{
                            endAdornment: isLoading ? (
                                <CircularProgress size={14} sx={{ mr: 2, color: "rgba(147,197,253,0.7)" }} />
                            ) : null,
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
                return wrap(
                    <Autocomplete
                        options={resolvedOptions}
                        loading={isLoading}
                        getOptionKey={(opt) => opt.value}
                        getOptionLabel={(opt) => opt.label ?? ""}
                        value={resolvedOptions.find((o) => o.value === values[field.name]) || null}
                        onChange={(_, selected) => setFieldValue(field.name, selected?.value ?? "")}
                        sx={{
                            "& .MuiAutocomplete-endAdornment": {
                                "& .MuiAutocomplete-clearIndicator": {
                                    color: "rgba(255,255,255,0.65)",
                                    "&:hover": { color: "rgba(255,255,255,0.45)" },
                                },
                                "& .MuiAutocomplete-loadingIndicator": {
                                    color: "rgba(147,197,253,0.7)",
                                },
                                "& .MuiAutocomplete-popupIndicator": {
                                    color: "rgba(255,255,255,0.65)",
                                    "&:hover": { color: "rgba(255,255,255,0.45)" },
                                }
                            }
                        }}
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
                                            {isLoading ? (
                                                <CircularProgress size={14} sx={{ color: "rgba(147,197,253,0.7)" }} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                );
            case "autocomplete-checkbox":
                return wrap(
                    <Autocomplete
                        size="medium"
                        multiple
                        options={[...resolvedOptions.sort((a, b) => a.label.localeCompare(b.label))]}
                        disableCloseOnSelect
                        loading={isLoading}
                        getOptionKey={(opt) => opt.value}
                        getOptionLabel={(opt) => opt.label ?? ""}
                        value={resolvedOptions.filter((o) => (values[field.name] || []).includes(o.value))}
                        onChange={(_, selected) =>
                            setFieldValue(
                                field.name,
                                selected.map((item) => item.value
                            ))
                        }
                        renderTags={(value) => (
                            <div style={{ marginLeft: '8px', color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
                                {value.map((option) => option.label).join(", ")}
                            </div>
                        )}
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
                        sx={{
                            "& .MuiAutocomplete-tag": {
                                margin: "0px",
                                my: "2px",
                                mr: "5px",
                                color: "rgba(255,255,255,0.85)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: "16px",
                                background: "rgba(255,255,255,0.06)",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "rgba(255,255,255,0.65) !important",
                                "&:hover": { color: "rgba(255,255,255,0.45)" },
                            }
                        }}
                        renderOption={(props, option, { selected }) => {
                            const { key, ...optionProps } = props;
                            const SelectionIcon = selected ? CheckBox : CheckBoxOutlineBlank;
                            return (
                                <li key={key} {...optionProps}>
                                    <SelectionIcon
                                        fontSize="small"
                                        className="mr-2 my-1"
                                    />
                                    {option.label}
                                </li>
                            );
                        }}

                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    {...commonProps}
                                    onBlur={handleBlur}
                                />
                            )
                        }}
                    />
                );
            case "nestedSelect":
                return wrap(
                    <NestedSelect
                        label={field.label}
                        options={field.options}
                        value={values[field.name]}
                        onSelect={(value) => {setFieldValue(field.name, value)}}
                    />
                );
            case "date":
                return wrap(
                    <DatePicker
                        label={
                            isRequired ? (
                                <span>
                                    {t(field.label)}
                                    <span style={{ color: "rgba(252,100,100,0.9)", marginLeft: "3px" }}>*</span>
                                </span>
                            ) : t(field.label)
                        }
                        value={values[field.name]}
                        onChange={(date) => setFieldValue(field.name, date)}
                        slotProps={{
                            textField: {
                                id: field.name,
                                size: "small",
                                fullWidth: true,
                                onBlur: handleBlur,
                                error: !!(errors[field.name] && touched[field.name]),
                                helperText:
                                    errors[field.name] && touched[field.name] ? errors[field.name] : null,
                                sx: {
                                    ...glassInputSx,
                                    "& .MuiPickersInputBase-root": {
                                        color: "rgba(255,255,255,0.85)",
                                        border: "1px solid rgba(255,255,255,0.28)",
                                        borderRadius: "10px",
                                        "& .MuiSvgIcon-root": {
                                            color: "rgba(255,255,255,0.65)",
                                        }
                                    }
                                },
                            },
                        }}
                    />
                );
            case "image":
                console.log(values[field.name])
                return wrap(
                    <>
                    <div className="w-full h-56 overflow-hidden rounded-lg">
                        <Button
                            component="label"
                            variant="contained"
                            sx={{
                                height: "224px",
                                width: "100%",
                                padding: 0,
                                position: "relative",
                                background: "transparent",
                                border: errors[field.name] ? "1.6px dashed rgba(255,0,0,0.5)" : "1.6px dashed rgba(255,255,255,0.2)",
                                borderRadius: "16px",
                                overflow: "hidden",
                            }}
                        >
                            {values[field.name] && !errors[field.name] ? (
                                    <img
                                        src={values[field.name] instanceof File || values[field.name] instanceof Blob
                                            ? URL.createObjectURL(values[field.name])
                                            : values[field.name]}
                                        alt="Preview"
                                        className="object-contain object-center w-full h-full"
                                    />
                                ) : (
                                <div className={`flex items-center justify-center gap-2 w-full h-full ${errors[field.name] ? "text-red-500" : "text-white/60"}`}>
                                    <CloudUploadIcon/>
                                        Upload files
                                </div>
                            )}

                            {/* Hidden input */}
                            <input
                                type="file"
                                accept="image/*"
                                name={field.name}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                aria-label="Upload image"
                                onChange={(event) =>
                                    setFieldValue(field.name, event.target.files[0])
                                }
                            />
                        </Button>
                    </div>
                        {
                            errors[field.name] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[field.name]}
                                </div>
                            )
                        }

                    </>
                )
            case "steps":

                return (
                    <div
                        key={field.name}
                        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                    >
                        {/* Header row */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span
                                style={{
                                    color: "rgba(255,255,255,0.6)",
                                    fontSize: "0.8rem",
                                    fontWeight: 500,
                                    letterSpacing: "0.03em",
                                }}
                            >
                                {t(field.label)}
                            </span>
                            <button
                                type="button"
                                onClick={addStep}
                                style={{
                                    background: "linear-gradient(135deg, rgba(96,165,250,0.85), rgba(59,130,246,0.75))",
                                    border: "1px solid rgba(147,197,253,0.3)",
                                    borderRadius: "7px",
                                    color: "rgba(255,255,255,0.92)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    padding: "4px 10px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    letterSpacing: "0.02em",
                                    transition: "all 0.18s ease",
                                    boxShadow: "0 2px 8px rgba(59,130,246,0.25)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(59,130,246,0.25)";
                                }}
                            >
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                    <circle cx="5.5" cy="5.5" r="5" stroke="currentColor" strokeWidth="1" />
                                    <path d="M5.5 3v5M3 5.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                {t("addStep") ?? "+ Add Step"}
                            </button>
                        </div>

                        {/* Empty state */}
                        {stepValues.length === 0 ? (
                            <div
                                style={{
                                    border: "1.5px dashed rgba(255,255,255,0.18)",
                                    borderRadius: "12px",
                                    padding: "28px 20px",
                                    textAlign: "center",
                                    color: "rgba(255,255,255,0.35)",
                                    fontSize: "0.82rem",
                                    background: "rgba(255,255,255,0.02)",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s ease, background 0.2s ease",
                                }}
                                onClick={addStep}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(147,197,253,0.35)";
                                    e.currentTarget.style.background = "rgba(147,197,253,0.04)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                }}
                            >
                                <div style={{ marginBottom: "6px", fontSize: "1.4rem", opacity: 0.4 }}>☰</div>
                                {t("noStepYet") ?? "Didn't have step yet, please click"}{" "}
                                <span
                                    style={{
                                        color: "rgba(147,197,253,0.8)",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    {t("addStep")}
                                </span>
                            </div>
                        ) : (
                            /* Step rows */
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {stepValues?.map((step, index) => (
                                    <div
                                        key={step._key}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "10px",
                                            padding: "8px 10px",
                                            transition: "border-color 0.18s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                                        }
                                    >
                                        {/* Step number badge */}
                                        <div className="w-7 h-7 p-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-medium">
                                            {step.index}
                                        </div>
                                        <FormControl sx={{ m: 1,
                                                            "& .MuiFormLabel-root": {
                                                                color: "rgba(255,255,255,0.65)",
                                                            },
                                                            "& .MuiSvgIcon-root": {
                                                                color: "rgba(255,255,255,0.65)",
                                                            }
                                                        }}
                                                     fullWidth
                                                     size="small"
                                        >
                                            <InputLabel id="demo-select-small-label">{t('step')}</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={step.id}
                                                label="Step"
                                                onChange={(e) => updateStep(step.index, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    color: "rgba(255,255,255,0.85)",

                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#fff",
                                                    },
                                                }}
                                             >
                                                {
                                                    stepOptions.length > 0 ? (
                                                        stepOptions.map((opt) => (
                                                            <MenuItem value={opt.value}>{opt.label}</MenuItem>
                                                        ))
                                                    ): (
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                    )
                                                }
                                            </Select>
                                        </FormControl>

                                        {/* Remove button */}
                                        <Tooltip title={t('remove')}>
                                            <IconButton
                                                onClick={() => removeStep(step._key)}
                                                sx={{
                                                    color: "#fff"
                                                }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Validation error */}
                        {errors[field.name] && touched[field.name] && (
                            <div style={{ color: "rgba(255, 0, 0, 1)", fontSize: "0.72rem", paddingLeft: "2px" }}>
                                {errors[field.name]}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    // ─── Nested "Add New" dialog ──────────────────────────────────────────────
    const activeAddNew = addNewDialog.field?.addNew ?? null;
    const addNewFormikRef = useRef(null);

    const renderNestedDialog = () => {
        if (!activeAddNew) return null;

        const nestedFields = activeAddNew.fields ?? [];
        const nestedInitialValues = activeAddNew.initialValues ??
            Object.fromEntries(nestedFields.map((f) => [f.name, ""]));

        return (
            <Dialog
                open={addNewDialog.open}
                onClose={() => {
                    addNewFormikRef.current?.resetForm();
                    setAddNewDialog({ open: false, field: null });
                }}
                // Render on top of the parent dialog
                style={{ zIndex: 1400 }}
                transitionDuration={{ enter: 220, exit: 120 }}
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: "rgba(2,6,23,0.45)",
                            backdropFilter: "blur(4px)",
                        },
                    },
                }}
                sx={dialogPaperSx}
            >
                <DialogTitle sx={dialogTitleSx}>
                    {activeAddNew.title ?? t("add.new")}
                </DialogTitle>

                <div style={dividerStyle} />

                <Formik
                    innerRef={addNewFormikRef}
                    initialValues={nestedInitialValues}
                    validationSchema={activeAddNew.validationSchema}
                    onSubmit={handleAddNewSubmit}
                    enableReinitialize
                >
                    {(formikProps) => (
                        <Form>
                            <DialogContent
                                sx={{
                                    pt: 2,
                                    px: 2.5,
                                    pb: 1.5,
                                    maxHeight: "55vh",
                                    overflowY: "auto",
                                    "&::-webkit-scrollbar": { width: "4px" },
                                    "&::-webkit-scrollbar-track": { background: "transparent" },
                                    "&::-webkit-scrollbar-thumb": {
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "4px",
                                    },
                                }}
                            >
                                {(() => {
                                    const useGrid = nestedFields.length > 5;
                                    return (
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: useGrid ? "repeat(2, 1fr)" : "1fr",
                                            gap: "16px",
                                        }}
                                             className="dialog-fields-grid"
                                        >
                                            {nestedFields.map((field) => (
                                                <div
                                                    key={field.name}
                                                    style={{
                                                        gridColumn: (useGrid && field.fullWidth) ? "1 / -1" : undefined,
                                                    }}
                                                >
                                                    {renderField(formikProps, field)}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </DialogContent>

                            <div style={bottomDividerStyle} />

                            <DialogActions sx={{ pb: 2, px: 2.5, gap: 1 }}>
                                <Button
                                    onClick={() => {
                                        addNewFormikRef.current?.resetForm();
                                        setAddNewDialog({ open: false, field: null });
                                    }}
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
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    size="small"
                                    sx={{
                                        borderRadius: "9px",
                                        background:
                                            "linear-gradient(135deg, rgba(96,165,250,0.85) 0%, rgba(59,130,246,0.75) 100%)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(147,197,253,0.3)",
                                        boxShadow:
                                            "0 4px 16px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                                        color: "rgba(255,255,255,0.95)",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        px: 2.5,
                                        textTransform: "none",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, rgba(96,165,250,0.95) 0%, rgba(59,130,246,0.9) 100%)",
                                            boxShadow:
                                                "0 6px 20px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
                                            transform: "translateY(-1px)",
                                        },
                                        transition: "all 0.18s ease",
                                    }}
                                >
                                    {t("buttons.create")}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        );
    };

    return (
        <>
            <GlobalStyles styles={{
                "@media (max-width: 480px)": {
                    ".dialog-fields-grid": {
                        gridTemplateColumns: "1fr !important",
                    },
                },
            }} />
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
                sx={dialogPaperSx}
            >
                <DialogTitle sx={dialogTitleSx}>
                    {title}
                </DialogTitle>

                <div style={dividerStyle} />

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
                                    pt: 2,
                                    px: 2.5,
                                    pb: 1.5,
                                    maxHeight: "65vh",
                                    overflowY: "auto",
                                    "&::-webkit-scrollbar": { width: "4px" },
                                    "&::-webkit-scrollbar-track": { background: "transparent" },
                                    "&::-webkit-scrollbar-thumb": {
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "4px",
                                        "&:hover": { background: "rgba(255,255,255,0.25)" },
                                    },
                                }}
                            >
                                {(() => {
                                    const visibleFields = fields.filter((field) => !(isUpdate && field.hideOnUpdate));
                                    const useGrid = visibleFields.length > 5;
                                    return (
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: useGrid ? "repeat(2, 1fr)" : "1fr",
                                            gap: "16px",
                                        }}
                                             className="dialog-fields-grid"
                                        >
                                            {visibleFields.map((field) => (
                                                <div
                                                    key={field.name}
                                                    style={{
                                                        gridColumn: (useGrid && field.fullWidth) ? "1 / -1" : undefined,
                                                    }}
                                                >
                                                    {renderField(formikProps, field)}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </DialogContent>

                            <div style={bottomDividerStyle} />

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
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    size="small"
                                    disabled={isSubmitting}
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
                                        "&.Mui-disabled": {
                                            background: "linear-gradient(135deg, rgba(96,165,250,0.4) 0%, rgba(59,130,246,0.35) 100%)",
                                            color: "rgba(255,255,255,0.45)",
                                        },
                                        transition: "all 0.18s ease",
                                    }}
                                >
                                    {/* Wrapper controls the layout */}
                                    <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ visibility: isSubmitting ? "hidden" : "visible" }}>
                                        {isUpdate ? t("buttons.update") : t("buttons.create")}
                                    </span>
                                        {isSubmitting && (
                                            <CircularProgress
                                                size={14}
                                                sx={{
                                                    color: "rgba(255,255,255,0.7)",
                                                    position: "absolute",
                                                }}
                                            />
                                        )}
                                </span>
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* Nested "Add New" dialog — rendered outside the parent Dialog to avoid z-index issues */}
            {addNewDialog.open && renderNestedDialog()}
        </>
    );
}

export default DialogAddEditCus;
// const memoizedDialogAddEditCus = memo(DialogAddEditCus);
// export default memoizedDialogAddEditCus;