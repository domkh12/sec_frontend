import { useState, useEffect } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function SelectFilter({
                          options = [],
                          value = '',
                          onChange,
                          label = 'Select',
                          width = 150,
                          disabled = false,
                          required = false,
                          error = false,
                          helperText = '',
                          multiple = false,
                          renderValue,
                          ...props
                      }) {
    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        if (onChange) onChange(event);
    };

    const styleSelect = {
        minWidth: width,
        maxWidth: multiple ? width * 2 : width,

        // Label
        "& .MuiInputLabel-root": {
            color: error ? "rgba(252,165,165,0.9)" : "rgba(255,255,255,0.5)",
            fontSize: "0.78rem",
            letterSpacing: "0.04em",
            fontWeight: 500,
            transition: "color 0.2s ease",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: error ? "rgba(252,165,165,1)" : "rgba(255,255,255,0.95)",
        },
        "& .MuiInputLabel-root.Mui-shrink": {
            color: error ? "rgba(252,165,165,0.85)" : "rgba(255,255,255,0.7)",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
        },

        // Root input
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            background: disabled
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: error
                ? "inset 0 1px 0 rgba(252,165,165,0.15), 0 4px 16px rgba(0,0,0,0.2)"
                : "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",

            "& fieldset": {
                borderColor: error
                    ? "rgba(252,165,165,0.5)"
                    : "rgba(255,255,255,0.15)",
                borderWidth: "1px",
                transition: "border-color 0.2s ease",
            },
            "&:hover": {
                background: disabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.11)",
                boxShadow: error
                    ? "inset 0 1px 0 rgba(252,165,165,0.2), 0 6px 20px rgba(0,0,0,0.25)"
                    : "inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 20px rgba(0,0,0,0.25)",
            },
            "&:hover fieldset": {
                borderColor: error ? "rgba(252,165,165,0.7)" : "rgba(255,255,255,0.3)",
            },
            "&.Mui-focused": {
                background: "rgba(255,255,255,0.12)",
                boxShadow: error
                    ? "inset 0 1px 0 rgba(252,165,165,0.25), 0 0 0 3px rgba(252,165,165,0.12), 0 8px 24px rgba(0,0,0,0.3)"
                    : "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 3px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.3)",
            },
            "&.Mui-focused fieldset": {
                borderColor: error ? "rgba(252,165,165,0.85)" : "rgba(255,255,255,0.45)",
                borderWidth: "1px",
            },
            "&.Mui-disabled": {
                opacity: 0.5,
            },
        },

        // Selected value text
        "& .MuiSelect-select": {
            color: disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.92)",
            padding: "8px 14px",
            fontSize: "0.82rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
        },

        // Dropdown arrow icon
        "& .MuiSelect-icon": {
            color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.45)",
            transition: "color 0.2s ease, transform 0.2s ease",
            fontSize: "1.1rem",
        },
        "& .MuiSelect-iconOpen": {
            color: "rgba(255,255,255,0.75)",
        },
    };

    // Dropdown paper (the floating menu)
    const menuProps = {
        PaperProps: {
            sx: {
                mt: 0.75,
                borderRadius: "12px",
                background: "rgba(15, 23, 42, 0.75)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
                "& .MuiList-root": {
                    padding: "6px",
                },
                "& .MuiMenuItem-root": {
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.78)",
                    padding: "7px 12px",
                    letterSpacing: "0.02em",
                    transition: "all 0.15s ease",
                    "&:hover": {
                        background: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                    },
                    "&.Mui-selected": {
                        background: "rgba(96,165,250,0.2)",
                        color: "#93c5fd",
                        border: "1px solid rgba(96,165,250,0.3)",
                        "&:hover": {
                            background: "rgba(96,165,250,0.3)",
                        },
                    },
                    "&.Mui-disabled": {
                        color: "rgba(255,255,255,0.25)",
                        fontStyle: "italic",
                    },
                },
            },
        },
    };

    const renderOptions = () => {
        if (!options || options.length === 0) {
            return (
                <MenuItem disabled value="">
                    <em>No options available</em>
                </MenuItem>
            );
        }
        return options.map((option) => {
            if (typeof option === "string") {
                return <MenuItem key={option} value={option}>{option}</MenuItem>;
            }
            return (
                <MenuItem
                    key={option.value ?? option.id}
                    value={option.value ?? option.id}
                    disabled={option.disabled || false}
                >
                    {option.label || option.name || option.value}
                </MenuItem>
            );
        });
    };

    return (
        <Box sx={{ minWidth: width }}>
            <FormControl
                fullWidth
                size="small"
                sx={styleSelect}
                disabled={disabled}
                required={required}
                error={error}
            >
                <InputLabel id={`select-filter-${label}`}>{label}</InputLabel>
                <Select
                    labelId={`select-filter-${label}`}
                    id={`select-${label}`}
                    value={selectedValue}
                    label={label}
                    onChange={handleChange}
                    multiple={multiple}
                    renderValue={renderValue}
                    MenuProps={menuProps}
                    {...props}
                >
                    {renderOptions()}
                </Select>
                {helperText && (
                    <Box sx={{
                        fontSize: "0.72rem",
                        color: error ? "rgba(252,165,165,0.85)" : "rgba(255,255,255,0.4)",
                        mt: 0.5,
                        ml: 1.5,
                        letterSpacing: "0.03em",
                    }}>
                        {helperText}
                    </Box>
                )}
            </FormControl>
        </Box>
    );
}

export default SelectFilter;