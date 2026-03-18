import React, { useEffect, useState } from 'react';
import {
    Menu,
    MenuItem,
    Box,
    Typography,
    Button,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from "react-i18next";

const NestedDepartmentSelect = ({
                                    options = [],
                                    value,
                                    onSelect,
                                    label = "table.deptAndLine", // Use the i18n key we created
                                    placeholder = "Select...",
                                }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [activeDept, setActiveDept] = useState(null);
    const [selectedText, setSelectedText] = useState("");
    const { t } = useTranslation();

    const handleOpenMain = (event) => setAnchorEl(event.currentTarget);

    const handleCloseAll = () => {
        setAnchorEl(null);
        setSubMenuAnchorEl(null);
        setActiveDept(null);
    };

    const handleDeptHover = (event, dept) => {
        if (dept.lines?.length > 0) {
            setSubMenuAnchorEl(event.currentTarget);
            setActiveDept(dept);
        } else {
            setSubMenuAnchorEl(null);
        }
    };

    useEffect(() => {
        if (!value || !options.length) {
            setSelectedText("");
            return;
        };

        const dept = options.find(d => d.id === value.deptId);
        if (!dept) return;

        let displayName = dept.name;
        if (value.lineId) {
            const line = dept.lines?.find(l => l.id === value.lineId);
            if (line) displayName = `${dept.name} > ${line.name}`;
        }
        setSelectedText(displayName);
    }, [value, options]);

    const handleSelect = (deptId, lineId = null) => {
        const dept = options.find(d => d.id === deptId);
        if (!dept) return;

        let selectionData = { deptId: dept.id, lineId: lineId };
        if (onSelect) onSelect(selectionData);
        handleCloseAll();
    };

    // --- STYLES ---
    const glassMenuSx = {
        background: "rgba(15,23,42,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        "& .MuiMenuItem-root": {
            m: 0.5,
            borderRadius: "8px",
            color: "#eee",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
        }
    };

    return (
        <Box sx={{ width: '100%' }}>

            <Button
                fullWidth
                onClick={handleOpenMain}
                endIcon={<KeyboardArrowDownIcon sx={{ opacity: 0.5 }} />}
                sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    padding: "8.5px 14px",
                    color: selectedText ? "#fff" : "rgba(255,255,255,0.4)",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "rgba(255,255,255,0.3)"
                    }
                }}
            >
                <Typography variant="body2" noWrap>
                    {selectedText || t(label)}
                </Typography>
            </Button>

            {/* Departments Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseAll}
                PaperProps={{ sx: { ...glassMenuSx, width: anchorEl ? anchorEl.clientWidth : 'auto' } }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                {options.map((dept) => (
                    <MenuItem
                        key={dept.id}
                        onMouseEnter={(e) => handleDeptHover(e, dept)}
                        onClick={() => handleSelect(dept.id)} // Selects dept alone if no line chosen
                        sx={{ justifyContent: 'space-between' }}
                    >
                        {dept.name}
                        {dept.lines?.length > 0 && <ChevronRightIcon fontSize="small" />}
                    </MenuItem>
                ))}
            </Menu>

            {/* Lines Sub-Menu */}
            <Menu
                anchorEl={subMenuAnchorEl}
                open={Boolean(subMenuAnchorEl)}
                onClose={() => setSubMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    sx: {
                        ...glassMenuSx,
                        minWidth: '200px',
                        ml: 0.5, // Small gap between menus
                        // THIS FIXES THE TOP ALIGNMENT:
                        mt: -0.5,
                    },
                    onMouseEnter: () => {},
                    onMouseLeave: () => setSubMenuAnchorEl(null)
                }}
                sx={{
                    pointerEvents: 'none',
                    // This ensures the sub-menu top is exactly level with the main menu top
                    "& .MuiPaper-root": {
                        marginTop: '-48px', // Adjust this value to match your Main Menu's vertical offset
                    }
                }}
            >
                <Box sx={{ pointerEvents: 'auto' }}>
                    {activeDept?.lines.map((line) => (
                        <MenuItem
                            key={line.id}
                            onClick={() => handleSelect(activeDept.id, line.id)}
                        >
                            {line.name}
                        </MenuItem>
                    ))}
                </Box>
            </Menu>
        </Box>
    );
};

export default NestedDepartmentSelect;