import {Chip, Paper} from "@mui/material";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import {useState} from "react";
import NumberFlow from '@number-flow/react'

function StatCardsDash() {
    const [value, setValue] = useState(42)
    return(
        <Paper sx={{
            width: "100%",
            padding: "10px",
            borderRadius: "16px",
        }}>
            <div className="flex justify-start items-center gap-3">
                <Chip label={<ElectricBoltIcon/>} sx={{
                    width: "50px",
                    height: "50px",
                    marginLeft: "10px",
                    borderRadius: "16px",
                }}/>
                <p>Total Output</p>
            </div>
            <div className="flex justify-center items-center pt-5">
                <NumberFlow value={100} />
            </div>
        </Paper>
    )
}

export default StatCardsDash;