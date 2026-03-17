import React, {useEffect, useState} from 'react';
import {
    Menu,
    MenuItem,
    TextField,
    Box,
    Typography,
    Paper
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Static Data for testing
const DEPARTMENTS = [
    {
        id: 1,
        name: "Sewing",
        lines: [{ id: 101, name: "Line 01" }, { id: 102, name: "Line 02" }, { id: 103, name: "Line 03" }]
    },
    {
        id: 2,
        name: "Cutting",
        lines: [{ id: 201, name: "Table A" }, { id: 202, name: "Table B" }]
    },
    {
        id: 3,
        name: "QC",
        lines: [{ id: 301, name: "Inspection Room 1" }, { id: 302, name: "Inspection Room 2" }]
    },
    {
        id: 4,
        name: "Packing",
        lines: [] // Test department with no lines
    }
];

const NestedDepartmentSelect = ({
                                options = [],
                                value,
                                onSelect,
                                label = "Department & Line",
                                placeHolder = "Select...",
                                }) => {
    // UI State
    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [activeDept, setActiveDept] = useState(null);
    const [selectedText, setSelectedText] = useState("");

    // Handlers
    const handleOpenMain = (event) => setAnchorEl(event.currentTarget);

    const handleCloseAll = () => {
        setAnchorEl(null);
        setSubMenuAnchorEl(null);
        setActiveDept(null);
    };

    const handleDeptHover = (event, dept) => {
        if (dept.lines.length > 0) {
            setSubMenuAnchorEl(event.currentTarget);
            setActiveDept(dept);
        } else {
            setSubMenuAnchorEl(null);
            setActiveDept(null);
        }
    };

    useEffect(() => {
        console.log(value);
        if (!value || !options.length) return;

        const dept = options.find(d => d.id === value.deptId);
        if (!dept) return;

        let displayName = dept.name;

        if (value.lineId) {
            const line = dept.lines?.find(l => l.id === value.lineId);
            if (line) {
                displayName = `${dept.name} > ${line.name}`;
            }
        }


        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedText(displayName);
    }, [value, options]);

    const handleSelect = (deptId, lineId = null) => {
        const dept = options.find(d => d.id === deptId);
        if (!dept) return;

        let displayName = dept.name;
        let selectionData = { deptId: dept.id, lineId: null };

        if (lineId) {
            const line = dept.lines.find(l => l.id === lineId);
            if (line) {
                displayName = `${dept.name} > ${line.name}`;
                selectionData.lineId = line.id;
            }
        }

        setSelectedText(displayName);

        // Return values to parent
        if (onSelect) {
            onSelect(selectionData);
        }

        handleCloseAll();
    };

    // Shared Glass Styles
    const glassMenuSx = {
        background: "rgba(15,23,42,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        mt: 0.5,
        "& .MuiMenuItem-root": {
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.875rem",
            borderRadius: "8px",
            transition: "all 0.2s ease",
            "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#fff"
            },
        },
        "& .MuiList-root": { padding: "4px" },
    };

    const glassInputSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.92)",
            "& fieldset": { borderColor: "rgba(255,255,255,0.18)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.38)" },
            "&.Mui-focused fieldset": { borderColor: "rgba(147,197,253,0.6)" },
        },
        "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" }
    };

    return (
        <Box>
            <TextField
                size="small"
                fullWidth
                label="Department & Line"
                value={selectedText}
                onClick={handleOpenMain}
                placeholder="Hover to see lines..."
                InputProps={{ readOnly: true }}
                sx={glassInputSx}
            />

            {/* Main Level: Departments */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseAll}
                PaperProps={{ sx: glassMenuSx }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                {options.map((dept) => (
                    <MenuItem
                        key={dept.id}
                        onMouseEnter={(e) => handleDeptHover(e, dept)}
                        onClick={() => handleSelect(dept.id)}
                        sx={{
                            minWidth: '220px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            background: activeDept?.id === dept.id ? "rgba(255,255,255,0.05)" : "transparent"
                        }}
                    >
                        <Typography variant="body2">{dept.name}</Typography>
                        {dept.lines?.length > 0 && (
                            <ChevronRightIcon sx={{ fontSize: '1.1rem', opacity: 0.5 }} />
                        )}
                    </MenuItem>
                ))}
            </Menu>

            {/* Sub Level: Lines (Cascading to the right) */}
            <Menu
                anchorEl={subMenuAnchorEl}
                open={Boolean(subMenuAnchorEl)}
                onClose={() => setSubMenuAnchorEl(null)}
                PaperProps={{ sx: glassMenuSx }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                // Keep the menu open when moving from Dept to Line list
                MenuListProps={{ onMouseLeave: () => setSubMenuAnchorEl(null) }}
                sx={{ pointerEvents: 'none', ml: 1, mt: -1 }} // Allows mouse to pass through gap
            >
                <Box sx={{ pointerEvents: 'auto' }}>
                    {activeDept?.lines.map((line) => (
                        <MenuItem
                            key={line.id}
                            onClick={() => handleSelect(activeDept.id, line.id)}
                            sx={{
                                minWidth: '180px',
                                "&:hover": { backgroundColor: "rgba(147,197,253,0.15) !important" }
                            }}
                        >
                            <Typography variant="body2">{line.name}</Typography>
                        </MenuItem>
                    ))}
                </Box>
            </Menu>
        </Box>
    );
};

export default NestedDepartmentSelect;