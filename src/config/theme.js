import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
      primary: {
          main: '#092D74',
      }
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
                body: {
                    backgroundColor: "#0a0f2c", // dark blue background
                },
                // "*": {
                //     scrollbarWidth: "thin",
                //     scrollbarColor: "rgba(255,255,255,0.35) transparent", // Firefox
                // },
                // "*::-webkit-scrollbar": {
                //     width: "4px",
                //     height: "4px",
                // },
                // "*::-webkit-scrollbar-track": {
                //     background: "transparent",
                // },
                // "*::-webkit-scrollbar-thumb": {
                //     background: "rgba(255,255,255,0.35)",
                //     borderRadius: "100px",
                // },
                // "*::-webkit-scrollbar-thumb:hover": {
                //     background: "rgba(255,255,255,0.65)",
                // },
                // "*::-webkit-scrollbar-corner": {
                //     background: "transparent",
                // },
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

export const textFieldStyle = {
    "& .MuiInputBase-input": {
        color: "#fff",
    },

    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",

        // default border
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#888",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
        },
    },

    "& .MuiFormLabel-root": {
        color: "rgba(255,255,255,0.65)",
    },

    "& .MuiSvgIcon-root": {
        color: "rgba(255,255,255,0.65)",
    },
};

export const CARD_THEMES = {
    emerald: { gradient: "linear-gradient(149deg,#5DCAA5 0%,#0F6E56 100%)", text: "#E1F5EE", dot: "rgba(255,255,255,0.18)" },
    ocean:   { gradient: "linear-gradient(149deg,#85B7EB 0%,#185FA5 100%)", text: "#E6F1FB", dot: "rgba(255,255,255,0.18)" },
    sunset:  { gradient: "linear-gradient(149deg,#F0997B 0%,#993C1D 100%)", text: "#FAECE7", dot: "rgba(255,255,255,0.18)" },
    violet:  { gradient: "linear-gradient(149deg,#AFA9EC 0%,#3C3489 100%)", text: "#EEEDFE", dot: "rgba(255,255,255,0.18)" },
    rose:    { gradient: "linear-gradient(149deg,#ED93B1 0%,#72243E 100%)", text: "#FBEAF0", dot: "rgba(255,255,255,0.18)" },
    amber:   { gradient: "linear-gradient(149deg,#EF9F27 0%,#633806 100%)", text: "#FAEEDA", dot: "rgba(255,255,255,0.18)" },
    lime:    { gradient: "linear-gradient(149deg,#97C459 0%,#27500A 100%)", text: "#EAF3DE", dot: "rgba(255,255,255,0.18)" },
    crimson: { gradient: "linear-gradient(149deg,#F09595 0%,#791F1F 100%)", text: "#FCEBEB", dot: "rgba(255,255,255,0.18)" },
    slate:   { gradient: "linear-gradient(149deg,#B4B2A9 0%,#444441 100%)", text: "#F1EFE8", dot: "rgba(255,255,255,0.18)" },
    indigo:  { gradient: "linear-gradient(149deg,#7F77DD 0%,#26215C 100%)", text: "#EEEDFE", dot: "rgba(255,255,255,0.18)" },
};

export default theme;