import {Card} from "@mui/material";

function CardList({children}) {
    return(<Card
        sx={{
            borderRadius: {sm: "0px", md: "10px"},
            minHeight: 640,
            zIndex: 0,
            position: "relative"
        }}
    >
        {children}
    </Card>)
}

export default CardList;