import {createTheme} from "@mui/material";

const theme = createTheme({
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
        }
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

export default theme;