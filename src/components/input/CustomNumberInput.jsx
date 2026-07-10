import NumberField from "../ui/NumberField";

function CustomNumberInput({value, name}) {
    return(
        <NumberField
            value={value}
            name={name}
            sx={{
                "& .MuiButtonBase-root": {
                    display: "none",
                },
                "& .MuiFormHelperText-root": {
                    display: "none",
                },
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
            }}
        />
    )
}

export default CustomNumberInput;