import { Badge, Box, styled, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Overview from "./Overview";
import { 
  FaChartBar, 
  FaCog, 
  FaChartLine, 
  FaClipboardList, 
  FaFileAlt,
  FaIndustry,
  FaTshirt
} from "react-icons/fa";
import DateRangePicker from "../../components/input/DateRangePicker";

export default function Analytics() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
            transform: 'scale(.8)',
            opacity: 1,
            },
            '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
            },
        },
        }));

    return (
        <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <FaChartBar className="text-blue-400" size={24} />
                    <p className="text-white text-xl font-bold">Manufacturing Analytics</p>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    {/* blinking dot */}
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        className="mr-1"
                    ></StyledBadge>
                    <span>Live</span>
                </div>
            </div>
            
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2
                 }}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="analytics tabs"
                        sx={{
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#3b82f6",
                            },
                        }}
                    >
                        <Tab 
                            icon={<FaChartLine size={16} />}
                            iconPosition="start"
                            label="Overview" 
                            value={0} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                "&.Mui-selected": { 
                                    color: 'white',
                                },
                            }} 
                        />
                        <Tab 
                            icon={<FaChartLine size={16} />}
                            iconPosition="start"
                            label="Overview" 
                            value={0} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                "&.Mui-selected": { 
                                    color: 'white',
                                },
                            }} 
                        />
                        <Tab 
                            icon={<FaChartLine size={16} />}
                            iconPosition="start"
                            label="Overview" 
                            value={0} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                "&.Mui-selected": { 
                                    color: 'white',
                                },
                            }} 
                        />
                        <Tab 
                            icon={<FaChartLine size={16} />}
                            iconPosition="start"
                            label="Overview" 
                            value={0} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                "&.Mui-selected": { 
                                    color: 'white',
                                },
                            }} 
                        />
                        <Tab 
                            icon={<FaChartLine size={16} />}
                            iconPosition="start"
                            label="Overview" 
                            value={0} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                "&.Mui-selected": { 
                                    color: 'white',
                                },
                            }} 
                        />
                    </Tabs>
                    <DateRangePicker
                        onChange={({ start, end }) => console.log(start, end)}
                    />
                </Box>
                  
                {value === 0 && <Overview />}
                {value === 1 && <ProductionLine />}
                {value === 2 && <StyleDetail />}
            </Box>
        </div>
    );
}