import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    Box, TextField, MenuItem, Popover, InputAdornment,
    Typography, Avatar, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import {useGetUserQuery} from "../../redux/feature/user/userApiSlice.js";

const PAGE_SIZE = 15;

const SelectUserWithSearch = ({ value, onChange, status = "ACTIVE" }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1); // Starting at 1 based on your RTK query param
    const [items, setItems] = useState([]); // Local storage for accumulated infinite scroll items
    const [selected, setSelected] = useState(null);

    const listRef = useRef(null);
    const sentinelRef = useRef(null);
    const open = Boolean(anchorEl);

    // 1. RTK Query Hook
    // We only trigger this when the popover is open.
    const { data, isFetching, isLoading } = useGetUserQuery({
        pageNo: page,
        pageSize: 20,
        search: debouncedSearch,
    }, { skip: !open });

    // 2. Handle Debounce for Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page on new search
            setItems([]); // Clear current list for new results
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // 3. Accumulate Data
    // When RTK Query returns a new page, append it to our local 'items' state.
    useEffect(() => {
        if (data?.ids) {
            const newBatch = data.ids.map(id => data.entities[id]);

            setItems(prev => {
                // If it's the first page, just take the new batch
                if (page === 1) return newBatch;

                // Avoid duplicating items if RTK re-fetches the same page
                const existingIds = new Set(prev.map(i => i.id));
                const uniqueNewBatch = newBatch.filter(i => !existingIds.has(i.id));
                return [...prev, ...uniqueNewBatch];
            });
        }
    }, [data, page]);

    // 4. Infinite Scroll Observer
    useEffect(() => {
        if (!sentinelRef.current || !open || isFetching) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const hasMore = data ? page < data.totalPages : false;
                if (entry.isIntersecting && hasMore) {
                    setPage(prev => prev + 1);
                }
            },
            { root: listRef.current, threshold: 0.1 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [open, data, isFetching, page]);

    // Handlers
    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSelect = (emp) => {
        setSelected(emp);
        onChange?.(emp);
        handleClose();
    };

    const initials = (name) =>
        name ? name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() : "??";

    return (
        <Box>
            {/* Control Trigger */}
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
                        <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: "primary.main" }} src={selected.avatar}/>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {selected.nameEn || selected.nameEn}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
                                ID: {selected.id}
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

            {/* Dropdown Menu */}
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
                {/* Search Header */}
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

                {/* List Container */}
                <Box ref={listRef} sx={{ maxHeight: 300, overflowY: "auto", p: 0.5 }}>
                    {items.map((emp) => {
                        const isSelected = emp.id === selected?.id;
                        return (
                            <MenuItem
                                key={emp.id} onClick={() => handleSelect(emp)} selected={isSelected}
                                sx={{ borderRadius: 1, mb: 0.5, gap: 1.5, py: 1 }}
                            >
                                <Avatar sx={{ width: 32, height: 32, fontSize: 12 }} src={emp.avatar} alt={ emp.firstName || emp.firstName}>
                                    {initials(emp.avatar || emp.avatar)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500}>{emp.firstName || emp.firstName}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {emp.employeeId} • {emp.nameEn || 'N/A'}
                                    </Typography>
                                </Box>
                                {isSelected && <CheckIcon fontSize="small" color="primary" />}
                            </MenuItem>
                        );
                    })}

                    {/* Loading & Empty States */}
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

                    {/* Sentinel for Intersection Observer */}
                    <Box ref={sentinelRef} sx={{ height: 10 }} />
                </Box>
            </Popover>
        </Box>
    );
};

export default SelectUserWithSearch;