import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, Box, Button, Tooltip, TextField, InputAdornment, Skeleton, Chip, Collapse, Typography,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {Search, FilterListOff} from "@mui/icons-material";
import DataNotFound from "../error/DataNotFound.jsx";
import {memo, useMemo, useCallback} from "react";
import SelectFilter from "../select/SelectFilter.jsx";
import RowTableComponent from "./RowTableComponent.jsx";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import {green} from "@mui/material/colors";

// ── Stable style objects (defined OUTSIDE component — never recreated) ──────
const cellSx = {
    border: "1px solid rgba(255,255,255,0.13)",
    textAlign: "center",
    color: "#fff",
    fontSize: "0.82rem",
    padding: "10px 14px",
};

const headerCellSx = {
    fontSize: "0.8rem",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.12)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    whiteSpace: "nowrap",
};

const paginationSx = {
    background: "rgba(255,255,255,0.04)",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.78rem",
    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
        color: "rgba(255,255,255,0.7)", fontSize: "0.78rem",
    },
    "& .MuiTablePagination-actions button": {
        color: "rgba(255,255,255,0.75)",
        "&:hover": { color: "#fff", background: "rgba(255,255,255,0.1)" },
        "&.Mui-disabled": { color: "rgba(255,255,255,0.25)" },
    },
    "& .MuiSelect-icon": { color: "rgba(255,255,255,0.65)" },
    "& .MuiInputBase-root": { color: "rgba(255,255,255,0.75)" },
};

const containerSx = { background: "transparent" };
const wrapperStyle = {
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px rgba(0,0,0,0.3)",
};
const searchTextField = {
    minWidth: 200,
    width: "100%",
    "& .MuiInputBase-input": {
        color: "#fff",
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.62)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset": {
            borderColor: "rgba(255,255,255,0.3)",
        },
        "&:hover fieldset": {
            borderColor: "rgba(255,255,255,0.6)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#fff",
        },
    },
    "& .MuiInputAdornment-root": {
        color: "rgba(255,255,255,0.62)",
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        fontSize: "1.2rem",
    },
};

// Active filter chip styles
const activeChipSx = {
    height: 26,
    fontSize: "0.72rem",
    fontWeight: 600,
    borderRadius: "8px",
    background: "rgba(96,165,250,0.18)",
    border: "1px solid rgba(96,165,250,0.45)",
    color: "#93c5fd",
    "& .MuiChip-label": { px: 1.2 },
    "& .MuiChip-deleteIcon": {
        color: "rgba(147,197,253,0.6)",
        fontSize: "0.9rem",
        "&:hover": { color: "#93c5fd" },
    },
    "&:hover": { background: "rgba(96,165,250,0.28)" },
    transition: "all 0.15s ease",
};

const clearAllBtnSx = {
    height: 26,
    fontSize: "0.72rem",
    fontWeight: 600,
    borderRadius: "8px",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#fca5a5",
    px: 1.5,
    minWidth: 0,
    textTransform: "none",
    "&:hover": {
        background: "rgba(239,68,68,0.25)",
        boxShadow: "0 0 10px rgba(239,68,68,0.25)",
    },
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
};

// Skeleton styles
const skeletonCellSx = {
    ...cellSx,
    padding: "8px 14px",
};

const skeletonRowSx = {
    background: "rgba(255,255,255,0.02)",
};

// ── Active Filter Chips ───────────────────────────────────────────────────────
const ActiveFilterChips = memo(function ActiveFilterChips({ filterConfig=[], filterValue, handleFilterChange, onClearAllFilters }) {
    const chips = useMemo(() => {
        if (!filterConfig || !filterValue) return [];
        const result = [];

        filterConfig.forEach((filter) => {
            const value = filterValue[filter.id];
            if (!value || value === "" || value === "all" || (Array.isArray(value) && value.length === 0)) return;

            if (filter.multiple && Array.isArray(value)) {
                value.forEach((v) => {
                    const option = filter.options?.find((o) => String(o.value ?? o) === String(v));
                    const label = option?.label ?? v;
                    result.push({
                        key: `${filter.id}__${v}`,
                        label: `${filter.label}: ${label}`,
                        onClear: () => {
                            const next = (filterValue[filter.id] || []).filter((x) => x !== v);
                            handleFilterChange(filter.id, next);
                        },
                    });
                });
            } else {
                const option = filter.options?.find((o) => String(o.value ?? o) === String(value));
                const label = option?.label ?? value;
                result.push({
                    key: filter.id,
                    label: `${filter.label}: ${label}`,
                    onClear: () => handleFilterChange(filter.id, filter.multiple ? [] : ""),
                });
            }
        });

        // Search chip
        if (filterValue.search?.trim()) {
            result.push({
                key: "search",
                label: `Search: "${filterValue.search}"`,
                onClear: () => handleFilterChange("search", ""),
            });
        }

        return result;
    }, [filterConfig, filterValue, handleFilterChange]);

    const handleClearAll = useCallback(() => {
        if (onClearAllFilters) {
            onClearAllFilters();
        } else {
            filterConfig?.forEach((filter) => handleFilterChange(filter.id, filter.multiple ? [] : ""));
            handleFilterChange("search", "");
        }
    }, [filterConfig, filterValue, handleFilterChange, onClearAllFilters]);

    if (!chips.length) return null;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.75, px: 2, pb: 3, pt: 0 }}>
            {chips.map((chip) => (
                <Chip key={chip.key} label={chip.label} onDelete={chip.onClear} size="small" sx={activeChipSx} />
            ))}
            {chips.length > 1 && (
                <Button onClick={handleClearAll} sx={clearAllBtnSx} size="small">
                    <FilterListOff sx={{ fontSize: 14 }} />
                    Clear all
                </Button>
            )}
        </Box>
    );
});

// ── Skeleton rows for loading state ───────────────────────────────────────────
const SkeletonRows = memo(function SkeletonRows({ columns, rowCount = 5, collapseColumns }) {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} sx={skeletonRowSx}>

                    {/* ── expand/collapse column ── */}
                    {
                        collapseColumns?.length > 0 && (
                            <TableCell sx={skeletonCellSx} style={{ width: 50 }}>
                                <Skeleton
                                    variant="rounded"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        mx: 'auto'
                                    }}
                                />
                            </TableCell>
                        )
                    }

                    {columns.map((col) => (
                        <TableCell
                            key={col.id}
                            align={col.align}
                            style={{ minWidth: col.minWidth }}
                            sx={skeletonCellSx}
                        >
                            {col.id === "action" ? (
                                <div className="flex justify-center items-center gap-5">
                                    <Skeleton variant="rounded" width={20} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    <Skeleton variant="rounded" width={20} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    <Skeleton variant="rounded" width={20} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    <Skeleton variant="rounded" width={20} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                </div>
                            ) : col.id === "status" ? (
                                <Box>
                                    <Skeleton variant="rounded" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                </Box>
                            ) : (
                                <Skeleton
                                    variant="text"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        fontSize: '0.82rem',
                                        maxWidth: col.id === 'id' ? 60 : '100%',
                                        mx: col.align === 'center' ? 'auto' : 0
                                    }}
                                />
                            )}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
});
// ── Main component ────────────────────────────────────────────────────────────
function TableCus({ columns, data, handleChangePage, handleChangeRowsPerPage, onEdit, onView, onDelete, onDeleteSub, onBlock, onUnblock, searchPlaceholderText, isFilterActive, handleFilterChange, filterValue, isFetching = false, filterConfig, onClearAllFilters, collapseColumns, collapseDataKey, handleFile, onStockIn, onStockOut }) {
    const { t } = useTranslation();
    const { ids, entities, totalElements, pageSize, pageNo } = data;

    const tView   = useMemo(() => t("table.view"),   [t]);
    const tEdit   = useMemo(() => t("table.edit"),   [t]);
    const tDelete = useMemo(() => t("table.delete"), [t]);
    const tDeleteSub = useMemo(() => t("table.delete"), [t]);
    const tBlock = useMemo(() => t('table.block'), [t]);
    const tUnblock = useMemo(() => t('table.unblock'), [t]);
    const tFile = useMemo(() => t('table.file'), [t]);
    const tStockIn = useMemo(() => t('table.stockIn'), [t]);
    const tStockOut = useMemo(() => t('table.stockOut'), [t]);

    const tableContent = useMemo(() => {
        if (isFetching) {
            return <SkeletonRows columns={columns} collapseColumns={collapseColumns}/>;
        }
        if (!ids.length) {
            return (
                <TableRow>
                    <TableCell
                        align="center"
                        colSpan={columns.length + 1}
                        sx={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
                    >
                        <DataNotFound />
                    </TableCell>
                </TableRow>
            );
        }

        return ids.map((id, idx) => (
            <RowTableComponent
                key={id}
                id={id}
                idx={idx}
                entity={entities[id]}
                columns={columns}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                tView={tView}
                tEdit={tEdit}
                tDelete={tDelete}
                onBlock={onBlock}
                tBlock={tBlock}
                onUnblock={onUnblock}
                tUnblock={tUnblock}
                isCollapseRow={!!collapseColumns?.length}
                collapseColumns={collapseColumns}
                collapseDataKey={collapseDataKey}
                onDeleteSub={onDeleteSub}
                tDeleteSub={tDeleteSub}
                tFile={tFile}
                handleFile={handleFile}
                onStockIn={onStockIn}
                onStockOut={onStockOut}
                tStockIn={tStockIn}
                tStockOut={tStockOut}
            />
        ));
    }, [ids, entities, columns, onView, onEdit, onDelete, tView, tEdit, tDelete, onDeleteSub, tDeleteSub, isFetching, collapseColumns, collapseDataKey, handleFile, tFile, onStockIn, onStockOut, tStockIn, tStockOut]);

    return (
        <div className="rounded-xl overflow-hidden" style={wrapperStyle}>
            {isFilterActive && (
                <>
                    <div className="px-4 py-5 flex items-center flex-col md:flex-row gap-2 overflow-x-auto">
                        {filterConfig?.map((filter) => {
                            if (filter.id === "excel") {
                                return null;
                            }
                            return (
                                <SelectFilter
                                    key={filter.id}
                                    options={filter.options}
                                    value={filterValue?.[filter.id] || (filter.multiple ? [] : '')}
                                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                                    label={filter.label}
                                    width={filter.width || 150}
                                    multiple={filter.multiple || false}
                                    disabled={filter.disabled || false}
                                    required={filter.required || false}
                                    error={filter.error || false}
                                    helperText={filter.helperText}
                                />
                            )
                        }
                        )}
                        <TextField
                            size="small"
                            placeholder={searchPlaceholderText}
                            sx={searchTextField}
                            variant="outlined"
                            value={filterValue?.search || ""}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                        {
                            filterConfig?.map((filter) => (
                                filter.id === "excel" && (
                                        <Button loading={filter.isLoading} key={filter.id} onClick={filter.onClick} variant="contained" sx={{bgcolor: green[600], minWidth: 100}} startIcon={<PiMicrosoftExcelLogoFill/>}>
                                            Excel
                                        </Button>
                                    )
                            ))
                        }

                    </div>

                    {/* ── Active filter chips ── */}
                    <ActiveFilterChips
                        filterConfig={filterConfig}
                        filterValue={filterValue}
                        handleFilterChange={handleFilterChange}
                        onClearAllFilters={onClearAllFilters}
                    />
                </>
            )}

            <TableContainer sx={containerSx}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {collapseColumns?.length > 0 && (
                                <TableCell sx={{ ...headerCellSx, width: 40 }} /> // empty header for expand toggle
                            )}
                            {columns?.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }} sx={headerCellSx}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{tableContent}</TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[20, 50, 100, 1000]}
                component="div"
                count={totalElements || 0}
                rowsPerPage={pageSize}
                labelRowsPerPage={t("table.rowPerPage")}
                page={pageNo}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={paginationSx}
            />
        </div>
    );
}

export default memo(TableCus);