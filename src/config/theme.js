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
    }
});

export default theme;