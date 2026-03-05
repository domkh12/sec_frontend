import {Button} from "@mui/material";

function ButtonAddNew({onClick}) {
    return(
        <Button sx={{margin: 2}} variant="contained" onClick={onClick}>Add new</Button>
    )
}

export default ButtonAddNew;
