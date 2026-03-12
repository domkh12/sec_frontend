import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, Box, Button, Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import DataNotFound from "../error/DataNotFound.jsx";
import { memo, useMemo, useCallback } from "react";

// ── Stable style objects (defined OUTSIDE component — never recreated) ──────
const cellSx = {
    border: "1px solid rgba(255,255,255,0.13)",
    textAlign: "center",
    color: "#fff",
    fontSize: "0.82rem",
    padding: "10px 14px",
    backdropFilter: "blur(4px)",
};

const headerCellSx = {
    fontWeight: 700,
    fontSize: "0.7rem",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    whiteSpace: "nowrap",
};

const paginationSx = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(12px)",
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

const containerSx = { background: "transparent", backdropFilter: "blur(12px)" };
const wrapperStyle = {
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px rgba(0,0,0,0.3)",
};
const actionBoxSx = { display: "flex", justifyContent: "center", gap: 0.75 };
const statusBoxSx = { display: "flex", justifyContent: "center" };

const viewBtnSx = {
    minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
    background: "rgba(56,189,248,0.25)", border: "1px solid rgba(56,189,248,0.6)", color: "#7dd3fc",
    "&:hover": { background: "rgba(56,189,248,0.42)", boxShadow: "0 0 14px rgba(56,189,248,0.5)", transform: "translateY(-1px)" },
    transition: "all 0.15s ease",
};
const editBtnSx = {
    minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
    background: "rgba(96,165,250,0.25)", border: "1px solid rgba(96,165,250,0.6)", color: "#93c5fd",
    "&:hover": { background: "rgba(96,165,250,0.42)", boxShadow: "0 0 14px rgba(96,165,250,0.5)", transform: "translateY(-1px)" },
    transition: "all 0.15s ease",
};
const deleteBtnSx = {
    minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
    background: "rgba(239,68,68,0.22)", border: "1px solid rgba(239,68,68,0.55)", color: "#fca5a5",
    "&:hover": { background: "rgba(239,68,68,0.4)", boxShadow: "0 0 14px rgba(239,68,68,0.45)", transform: "translateY(-1px)" },
    transition: "all 0.15s ease",
};

const STATUS_STYLES = {
    ACTIVE:   { background: "rgba(34,197,94,0.15)",   border: "1px solid rgba(34,197,94,0.45)",   color: "#86efac" },
    INACTIVE: { background: "rgba(148,163,184,0.15)", border: "1px solid rgba(148,163,184,0.35)", color: "#cbd5e1" },
    BLOCKED:  { background: "rgba(239,68,68,0.15)",   border: "1px solid rgba(239,68,68,0.45)",   color: "#fca5a5" },
};
const STATUS_DEFAULT = { background: "rgba(148,163,184,0.15)", border: "1px solid rgba(148,163,184,0.35)", color: "#cbd5e1" };

const baseStatusSx = { px: 1.5, py: 0.3, borderRadius: "20px", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em" };

// ── Memoized single row ───────────────────────────────────────────────────────
const TableRowMemo = memo(function TableRowMemo({ id, idx, entity, columns, onView, onEdit, onDelete, tView, tEdit, tDelete }) {
    const rowSx = useMemo(() => ({
        background: idx % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
        transition: "background 0.15s ease",
        "&:hover": { background: "rgba(96,165,250,0.14)" },
    }), [idx]);

    const handleView   = useCallback(() => onView?.(entity),   [onView,   entity]);
    const handleEdit   = useCallback(() => onEdit?.(entity),   [onEdit,   entity]);
    const handleDelete = useCallback(() => onDelete?.(entity), [onDelete, entity]);

    return (
        <TableRow key={id} sx={rowSx}>
            {columns.map((col) => (
                <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }} sx={cellSx}>
                    {col.id === "action" ? (
                        <Box sx={actionBoxSx}>
                            {onView   && <Tooltip title={tView}><Button onClick={handleView}   sx={viewBtnSx}>  <Visibility sx={{ fontSize: 15 }} /></Button></Tooltip>}
                            {onEdit   && <Tooltip title={tEdit}><Button onClick={handleEdit}   sx={editBtnSx}>  <Edit        sx={{ fontSize: 15 }} /></Button></Tooltip>}
                            {onDelete && <Tooltip title={tDelete}><Button onClick={handleDelete} sx={deleteBtnSx}><Delete      sx={{ fontSize: 15 }} /></Button></Tooltip>}
                        </Box>
                    ) : col.id === "status" ? (
                        <Box sx={statusBoxSx}>
                            <Box sx={{ ...baseStatusSx, ...(STATUS_STYLES[entity[col.id]?.toUpperCase()] ?? STATUS_DEFAULT) }}>
                                {entity[col.id] || "—"}
                            </Box>
                        </Box>
                    ) : (
                        entity[col.id] ?? "—"
                    )}
                </TableCell>
            ))}
        </TableRow>
    );
});

// ── Main component ────────────────────────────────────────────────────────────
function TableCus({ columns, data, handleChangePage, handleChangeRowsPerPage, onEdit, onView, onDelete }) {
    const { t } = useTranslation();
    const { ids, entities, totalElements, pageSize, pageNo } = data;

    // Stable translation strings — avoids passing t() inline (new fn ref each render)
    const tView   = useMemo(() => t("table.view"),   [t]);
    const tEdit   = useMemo(() => t("table.edit"),   [t]);
    const tDelete = useMemo(() => t("table.delete"), [t]);

    const tableContent = useMemo(() => {
        if (!ids.length) {
            return (
                <TableRow>
                    <TableCell
                        align="center"
                        colSpan={columns.length}
                        sx={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
                    >
                        <DataNotFound />
                    </TableCell>
                </TableRow>
            );
        }

        return ids.map((id, idx) => (
            <TableRowMemo
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
            />
        ));
    }, [ids, entities, columns, onView, onEdit, onDelete, tView, tEdit, tDelete]);

    return (
        <div className="rounded-xl overflow-hidden" style={wrapperStyle}>
            <TableContainer sx={containerSx}>
                <Table>
                    <TableHead>
                        <TableRow>
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