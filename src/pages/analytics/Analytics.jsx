import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Overview from "./Overview";
// import TabPanel from '@mui/lab/TabPanel';

export default function Analytics() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="card-glass">
            <p className="text-zinc-50 mb-4">Garment analytics</p>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                    sx={{
                            "& .MuiTabs-indicator": {
                                backgroundColor: "white",
                            },
                        }}
                    >
                        <Tab label="Overview" value={0} 
                        sx={{ 
                            color: 'white', 
                            fontSize: '0.8rem', 
                            "&.Mui-selected": { 
                                color: 'white',
                            },
                        }} 
                        />
                    </Tabs>
                </Box>
                <Overview/>
            </Box>
        </div>
    )
}
