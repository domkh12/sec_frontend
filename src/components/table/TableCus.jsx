import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Box,
    Button,
    Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import DataNotFound from "../error/DataNotFound.jsx";

function TableCus({ columns, data, handleChangePage, handleChangeRowsPerPage, onEdit, onView, onDelete }) {
    const { t } = useTranslation();
    const { ids, entities, totalElements, pageSize, pageNo } = data;

    const cellSx = {
        border: "1px solid rgba(255,255,255,0.13)",
        textAlign: "center",
        color: "#fff",
        fontSize: "0.82rem",
        padding: "10px 14px",
        backdropFilter: "blur(4px)",
    };

    const tableContent = ids.length ? (
        ids.map((id, idx) => (
            <TableRow
                key={id}
                sx={{
                    background: idx % 2 === 0
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.02)",
                    transition: "background 0.15s ease",
                    "&:hover": {
                        background: "rgba(96,165,250,0.14)",
                    },
                }}
            >
                {columns.map((col) => (
                    <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }} sx={cellSx}>
                        {col.id === "action" ? (
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75 }}>
                                {onView && (
                                    <Tooltip title={t("table.view")}>
                                        <Button
                                            onClick={() => onView(entities[id])}
                                            sx={{
                                                minWidth: 0, width: 30, height: 30, padding: 0,
                                                borderRadius: "7px",
                                                background: "rgba(56,189,248,0.25)",
                                                border: "1px solid rgba(56,189,248,0.6)",
                                                color: "#7dd3fc",
                                                "&:hover": {
                                                    background: "rgba(56,189,248,0.42)",
                                                    boxShadow: "0 0 14px rgba(56,189,248,0.5)",
                                                    transform: "translateY(-1px)",
                                                },
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            <Visibility sx={{ fontSize: 15 }} />
                                        </Button>
                                    </Tooltip>
                                )}
                                {onEdit && (
                                    <Tooltip title={t("table.edit")}>
                                        <Button
                                            onClick={() => onEdit(entities[id])}
                                            sx={{
                                                minWidth: 0, width: 30, height: 30, padding: 0,
                                                borderRadius: "7px",
                                                background: "rgba(96,165,250,0.25)",
                                                border: "1px solid rgba(96,165,250,0.6)",
                                                color: "#93c5fd",
                                                "&:hover": {
                                                    background: "rgba(96,165,250,0.42)",
                                                    boxShadow: "0 0 14px rgba(96,165,250,0.5)",
                                                    transform: "translateY(-1px)",
                                                },
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            <Edit sx={{ fontSize: 15 }} />
                                        </Button>
                                    </Tooltip>
                                )}
                                {onDelete && (
                                    <Tooltip title={t("table.delete")}>
                                        <Button
                                            onClick={() => onDelete(entities[id])}
                                            sx={{
                                                minWidth: 0, width: 30, height: 30, padding: 0,
                                                borderRadius: "7px",
                                                background: "rgba(239,68,68,0.22)",
                                                border: "1px solid rgba(239,68,68,0.55)",
                                                color: "#fca5a5",
                                                "&:hover": {
                                                    background: "rgba(239,68,68,0.4)",
                                                    boxShadow: "0 0 14px rgba(239,68,68,0.45)",
                                                    transform: "translateY(-1px)",
                                                },
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 15 }} />
                                        </Button>
                                    </Tooltip>
                                )}
                            </Box>
                        ) : (
                            entities[id][col.id] || "—"
                        )}
                    </TableCell>
                ))}
            </TableRow>
        ))
    ) : (
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

    return (
        <div className="rounded-xl overflow-hidden" style={{
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px rgba(0,0,0,0.3)",
        }}>
            <TableContainer
                sx={{
                    background: "transparent",
                    backdropFilter: "blur(12px)",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns?.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
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
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{tableContent}</TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[20, 50, 100]}
                component="div"
                count={totalElements || 0}
                rowsPerPage={pageSize}
                labelRowsPerPage={t("table.rowPerPage")}
                page={pageNo}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "0.78rem",
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.78rem",
                    },
                    "& .MuiTablePagination-actions button": {
                        color: "rgba(255,255,255,0.75)",
                        "&:hover": { color: "#fff", background: "rgba(255,255,255,0.1)" },
                        "&.Mui-disabled": { color: "rgba(255,255,255,0.25)" },
                    },
                    "& .MuiSelect-icon": { color: "rgba(255,255,255,0.65)" },
                    "& .MuiInputBase-root": { color: "rgba(255,255,255,0.75)" },
                }}
            />
        </div>
    );
}

export default TableCus;