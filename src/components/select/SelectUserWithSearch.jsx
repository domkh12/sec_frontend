import { useState, useRef } from "react";
import {
    Box, TextField, MenuItem, Popover, InputAdornment,
    Typography, Avatar, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import { useGetUserLookupQuery } from "../../redux/feature/user/userApiSlice.js";

const SelectUserWithSearch = ({ value, onChange, status = "ACTIVE" }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);

    const listRef = useRef(null);
    const open = Boolean(anchorEl);

    const { data, isFetching } = useGetUserLookupQuery();

    // ✅ data is a plain array — filter directly
    const items = (data ?? []).filter(emp => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            emp.nameEn?.toLowerCase().includes(q) ||
            emp.nameKh?.toLowerCase().includes(q) ||
            emp.employeeId?.toLowerCase().includes(q)
        );
    });

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
        setSearch("");
    };

    const handleSelect = (emp) => {
        setSelected(emp);
        onChange?.(emp);
        handleClose();
    };

    const initials = (name) =>
        name ? name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() : "??";

    return (
        <Box>
            <Box
                onClick={handleOpen}
                sx={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    px: 2, py: 1.5, border: "1px solid", cursor: "pointer",
                    borderColor: open ? "primary.main" : "grey.300",
                    borderRadius: 2, bgcolor: "background.paper", minWidth: 280,
                    boxShadow: open ? "0 0 0 3px rgba(25, 118, 210, 0.12)" : "none",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "primary.main" },
                }}
            >
                {selected ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: "primary.main" }} src={selected.avatar} />
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {selected.nameEn || selected.nameKh}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
                                ID: {selected.employeeId}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.disabled">Select Employee...</Typography>
                )}
                <KeyboardArrowDownIcon
                    sx={{ color: "text.secondary", transition: "0.2s", transform: open ? "rotate(180deg)" : "none" }}
                />
            </Box>

            <Popover
                open={open} anchorEl={anchorEl} onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: { mt: 1, borderRadius: 2, width: anchorEl?.offsetWidth, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }
                    }
                }}
            >
                <Box sx={{ p: 1, borderBottom: "1px solid", borderColor: "grey.100" }}>
                    <TextField
                        size="small" fullWidth autoFocus placeholder="Search by name or ID..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ "& fieldset": { border: "none" }, bgcolor: "grey.50", borderRadius: 1 }}
                    />
                </Box>

                <Box ref={listRef} sx={{ maxHeight: 300, overflowY: "auto", p: 0.5 }}>
                    {items.map((emp) => {
                        const isSelected = emp.id === selected?.id;
                        return (
                            <MenuItem
                                key={emp.id} onClick={() => handleSelect(emp)} selected={isSelected}
                                sx={{ borderRadius: 1, mb: 0.5, gap: 1.5, py: 1 }}
                            >
                                <Avatar
                                    sx={{ width: 32, height: 32, fontSize: 12 }}
                                    src={emp.avatar}
                                    alt={emp.nameEn || emp.nameKh}
                                >
                                    {initials(emp.nameEn || emp.nameKh)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {emp.nameEn || emp.nameKh}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {emp.employeeId}
                                    </Typography>
                                </Box>
                                {isSelected && <CheckIcon fontSize="small" color="primary" />}
                            </MenuItem>
                        );
                    })}

                    {isFetching && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                            <CircularProgress size={20} />
                        </Box>
                    )}

                    {!isFetching && items.length === 0 && (
                        <Typography variant="body2" color="text.disabled" sx={{ py: 4, textAlign: "center" }}>
                            No users found
                        </Typography>
                    )}

                    <Box sx={{ height: 10 }} />
                </Box>
            </Popover>
        </Box>
    );
};

export default SelectUserWithSearch;