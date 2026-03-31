import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        fontFamily: [
            'Battambang',
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(','),
    },
    components:{
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: "0px"
                }
            },
            defaultProps: {
                elevation: 0,
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none"
                }
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "*": {
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.35) transparent", // Firefox
                },
                "*::-webkit-scrollbar": {
                    width: "4px",
                    height: "4px",
                },
                "*::-webkit-scrollbar-track": {
                    background: "transparent",
                },
                "*::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.35)",
                    borderRadius: "100px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(255,255,255,0.65)",
                },
                "*::-webkit-scrollbar-corner": {
                    background: "transparent",
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,   // 40rem
            md: 768,   // 48rem
            lg: 1024,  // 64rem
            xl: 1280,  // 80rem
            xxl: 1536, // 96rem (MUI calls this 'xl' by default, we can add 'xxl')
        },
    },
});

export const searchTextField = {
    width: "100%",
    "& .MuiInputBase-input": {
        color: "#fff",
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.62)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset": {
            borderColor: "rgba(255,255,255,0.3)",
        },
        "&:hover fieldset": {
            borderColor: "rgba(255,255,255,0.6)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#fff",
        },
    },
    "& .MuiInputAdornment-root": {
        color: "rgba(255,255,255,0.62)",
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        fontSize: "1.2rem",
    },
};

export default theme;