import { TextField } from "@mui/material";

function CustomTextField1({ name, label, value, onChange, type = "text", placeholder, error, helperText }) {
    return (
        <TextField
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        sx={{
            width: "100%",

            // Input text
            "& .MuiOutlinedInput-input": {
            color: "white",
            },

            // Placeholder
            "& .MuiOutlinedInput-input::placeholder": {
            color: "white",
            opacity: 0.7,
            },

            // Label
            "& .MuiInputLabel-root": {
            color: "white",
            },

            // Label when focused
            "& .MuiInputLabel-root.Mui-focused": {
            color: "white",
            },

            // Default border
            "& .MuiOutlinedInput-root fieldset": {
            borderColor: "white",
            },

            // Hover border
            "& .MuiOutlinedInput-root:hover fieldset": {
            borderColor: "white",
            },

            // Focused border
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: "white",
            },

            // Helper text
            "& .MuiFormHelperText-root": {
            color: "white",
            },
        }}
        />
    )
}

export default CustomTextField1;