import {useState} from "react";
import {FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

function PasswordField({ label, name, value, onChange, onBlur, error, helperText, sx }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl fullWidth size="small" error={error} sx={sx}>
            <InputLabel
                htmlFor={name}
                sx={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.875rem",
                    "&.Mui-focused": { color: "rgba(147,197,253,0.9)" },
                    "&.Mui-error": { color: "rgba(252,165,165,0.8)" },
                }}
            >
                {label}
            </InputLabel>
            <OutlinedInput
                id={name}
                name={name}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                label={label}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={showPassword ? "hide password" : "show password"}
                            onClick={() => setShowPassword((prev) => !prev)}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseUp={(e) => e.preventDefault()}
                            edge="end"
                            size="small"
                            sx={{
                                color: "rgba(255,255,255,0.4)",
                                "&:hover": { color: "rgba(147,197,253,0.85)", backgroundColor: "rgba(147,197,253,0.08)" },
                                transition: "color 0.2s ease",
                                mr: 0.25,
                            }}
                        >
                            {showPassword
                                ? <VisibilityOff sx={{ fontSize: "1rem" }} />
                                : <Visibility sx={{ fontSize: "1rem" }} />
                            }
                        </IconButton>
                    </InputAdornment>
                }
                sx={{
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
                }}
            />
            {helperText && (
                <FormHelperText sx={{ color: "rgba(252,165,165,0.8)", fontSize: "0.72rem" }}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
}

export default PasswordField;