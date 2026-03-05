import {Button} from "@mui/material";

function BackButton({onClick}){
    return(
        <Button variant="contained" sx={{margin: 2}} onClick={onClick}>
            Back
        </Button>
    )
}

export default BackButton;