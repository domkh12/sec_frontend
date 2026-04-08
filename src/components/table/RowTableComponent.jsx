import {
    Box,
    Button,
    Collapse, Dialog, DialogActions, DialogContent, IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import DataNotFound from "../error/DataNotFound.jsx";
import {memo, useCallback, useMemo, useState} from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Delete, Edit, KeyboardArrowUp, Visibility} from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { BiSolidArchiveIn } from "react-icons/bi";
import { BiSolidArchiveOut } from "react-icons/bi";

function RowTableComponent({
                               id, idx, entity, columns, collapseColumns,
                               onView, onEdit, onDelete, onBlock, onStockIn, onStockOut,
                               tView, tEdit, tDelete,tFile, handleFile, onDeleteSub, tStockIn, tStockOut, tDeleteSub, tBlock, tUnblock, onUnblock, isCollapseRow, collapseDataKey
                           }) {
        const [open, setOpen] = useState(false);

        const statusBoxSx = { display: "flex", justifyContent: "center" };
        const fileBtnSx = {
            minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
            background: "rgba(16,185,129,0.22)", border: "1px solid rgba(16,185,129,0.55)", color: "#10b981",
            "&:hover": { background: "rgba(16,185,129,0.4)", boxShadow: "0 0 14px rgba(16,185,129,0.45)", transform: "translateY(-1px)" },
            transition: "all 0.15s ease",
        };

        const baseStatusSx = { px: 1.5, py: 0.3, borderRadius: "20px", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em" };

        const blockBtnSx = {
            minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
            background: "rgba(251,191,36,0.22)", border: "1px solid rgba(251,191,36,0.55)", color: "#fbbf24",
            "&:hover": { background: "rgba(251,191,36,0.4)", boxShadow: "0 0 14px rgba(251,191,36,0.45)", transform: "translateY(-1px)" },
            transition: "all 0.15s ease",
        };

        const unblockBtnSx = {
            minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
            background: "rgba(34,197,94,0.22)", border: "1px solid rgba(34,197,94,0.55)", color: "#86efac",
            "&:hover": { background: "rgba(34,197,94,0.4)", boxShadow: "0 0 14px rgba(34,197,94,0.45)", transform: "translateY(-1px)" },
            transition: "all 0.15s ease",
        };

        const rowSx = useMemo(() => ({
            background: idx % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
            transition: "background 0.15s ease",
            "&:hover": { background: "rgba(96,165,250,0.14)" },
        }), [idx]);

        const STATUS_STYLES = {
            ACTIVE:       { background: "rgba(34,197,94,0.15)",   border: "1px solid rgba(34,197,94,0.45)",   color: "#86efac" },
            INACTIVE:     { background: "rgba(148,163,184,0.15)", border: "1px solid rgba(148,163,184,0.35)", color: "#cbd5e1" },
            BLOCKED:      { background: "rgba(239,68,68,0.15)",   border: "1px solid rgba(239,68,68,0.45)",   color: "#fca5a5" },
            OUT_OF_STOCK: { background: "rgba(239,68,68,0.15)",   border: "1px solid rgba(239,68,68,0.45)",   color: "#fca5a5" },
            LOW_STOCK:    { background: "rgba(234,179,8,0.15)",   border: "1px solid rgba(234,179,8,0.45)",   color: "#fde047" },
            AVAILABLE:    { background: "rgba(34,197,94,0.15)",   border: "1px solid rgba(34,197,94,0.45)",   color: "#86efac" },
        };
        const STATUS_DEFAULT = { background: "rgba(148,163,184,0.15)", border: "1px solid rgba(148,163,184,0.35)", color: "#cbd5e1" };

        const viewBtnSx = {
            minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
            background: "rgba(56,189,248,0.25)", border: "1px solid rgba(56,189,248,0.6)", color: "#7dd3fc",
            "&:hover": { background: "rgba(56,189,248,0.42)", boxShadow: "0 0 14px rgba(56,189,248,0.5)", transform: "translateY(-1px)" },
            transition: "all 0.15s ease",
        };

        const stockInBtnSx = {
            minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
            background: "rgba(251, 146, 60, 0.22)", // Orange tint
            border: "1px solid rgba(251, 146, 60, 0.55)",
            color: "#ffbb8d",
            "&:hover": {
                background: "rgba(251, 146, 60, 0.4)",
                boxShadow: "0 0 14px rgba(251, 146, 60, 0.45)",
                transform: "translateY(-1px)"
            },
            transition: "all 0.15s ease",
        };

        const stockOutBtnSx = {
            minWidth: 0, width: 30, height: 30, padding: 0, borderRadius: "7px",
            background: "rgba(16, 185, 129, 0.2)", // Emerald base
            border: "1px solid rgba(16, 185, 129, 0.5)",
            color: "#34d399",
            "&:hover": {
                background: "rgba(16, 185, 129, 0.35)",
                boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
                transform: "translateY(-1px)"
            },
            transition: "all 0.15s ease",
        };

        const actionBoxSx = { display: "flex", justifyContent: "center", gap: 0.75 };

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
            fontSize: "0.8rem",
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

        const handleView    = useCallback(() => onView?.(entity),    [onView,    entity]);
        const handleEdit    = useCallback(() => onEdit?.(entity),    [onEdit,    entity]);
        const handleDelete  = useCallback(() => onDelete?.(entity),  [onDelete,  entity]);
        const handleDeleteSub = useCallback((subRow) => {
            onDeleteSub?.(subRow);
        }, [onDeleteSub]);
        const handleBlock   = useCallback(() => onBlock?.(entity),   [onBlock,   entity]);
        const handleUnblock = useCallback(() => onUnblock?.(entity), [onUnblock, entity]);
        const handleFileClick = useCallback(() => handleFile?.(entity), [handleFile, entity]);
        const handleStockIn = useCallback(() => onStockIn?.(entity), [onStockIn, entity]);
        const handleStockOut = useCallback(() => onStockOut?.(entity), [onStockOut, entity]);
        const [imagePreview, setImagePreview] = useState(null);
        const isBlocked = entity.status?.toUpperCase() === "BLOCKED";

        const colSpan = columns.length + (isCollapseRow ? 1 : 0);

        return (
            <>
                <TableRow sx={rowSx}>
                    {isCollapseRow && (
                        <TableCell sx={{ ...cellSx, width: 40, padding: "0 6px" }}>
                            <IconButton size="small" onClick={() => setOpen((p) => !p)}>
                                {open ? <KeyboardArrowUp className={"text-white"} /> : <KeyboardArrowDownIcon className={"text-white"}/>}
                            </IconButton>
                        </TableCell>
                    )}
                    {columns.map((col) => (
                        <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth, maxWidth: col.maxWidth }} sx={cellSx}>
                            {col.id === "action" ? (
                                <Box sx={actionBoxSx}>
                                    { onStockIn &&(
                                        <Tooltip title={tStockIn}>
                                            <Button onClick={handleStockIn} sx={stockInBtnSx}>
                                                <BiSolidArchiveIn sx={{ fontSize: 15 }} />
                                            </Button>
                                        </Tooltip>
                                        )
                                    }
                                    {
                                        onStockOut && (
                                        <Tooltip title={tStockOut}>
                                            <Button onClick={handleStockOut} sx={stockOutBtnSx}>
                                                <BiSolidArchiveOut sx={{ fontSize: 15 }} />
                                            </Button>
                                        </Tooltip>
                                        )
                                    }
                                    {onView && (
                                        <Tooltip title={tView}>
                                            <Button onClick={handleView} sx={viewBtnSx}>
                                                <Visibility sx={{ fontSize: 15 }} />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {onEdit && (
                                        <Tooltip title={tEdit}>
                                            <Button onClick={handleEdit} sx={editBtnSx}>
                                                <Edit sx={{ fontSize: 15 }} />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {isBlocked ? (
                                        onUnblock && (
                                            <Tooltip title={tUnblock}>
                                                <Button onClick={handleUnblock} sx={unblockBtnSx}>
                                                    <KeyIcon fontSize="small" />
                                                </Button>
                                            </Tooltip>
                                        )
                                    ) : (
                                        onBlock && (
                                            <Tooltip title={tBlock}>
                                                <Button onClick={handleBlock} sx={blockBtnSx}>
                                                    <KeyOffIcon fontSize="small" sx={{ color: "#fca5a5" }} />
                                                </Button>
                                            </Tooltip>
                                        )
                                    )}
                                    { handleFile && (
                                        <Tooltip title={tFile}>
                                            <Button onClick={handleFileClick} sx={fileBtnSx}>
                                                <FolderRoundedIcon fontSize="small" sx={{ color: "#10b981" }} />
                                            </Button>
                                        </Tooltip>
                                    )
                                    }
                                    {onDelete && (
                                        <Tooltip title={tDelete}>
                                            <Button onClick={handleDelete} sx={deleteBtnSx}>
                                                <Delete sx={{ fontSize: 15 }} />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </Box>
                            ) : col.id === "status" ? (
                                <Box sx={statusBoxSx}>
                                    <Box sx={{ ...baseStatusSx, ...(STATUS_STYLES[entity[col.id]?.toUpperCase()] ?? STATUS_DEFAULT) }}>
                                        {entity[col.id] || "—"}
                                    </Box>
                                </Box>
                            ) : col.id === "image" ? (
                                <>
                                <Box onClick={() => setImagePreview(true)} sx={{width: "full", height: "60px", overflow: "hidden", cursor: "pointer"}}>
                                    <img src={entity[col.id] || "/images/placeholder.png"} alt={entity.name} className="object-contain object-center w-full h-full" />
                                </Box>
                                <Dialog
                                    open={!!imagePreview}
                                    onClose={() => setImagePreview(null)}
                                    maxWidth="md"
                                    fullWidth
                                    sx={{
                                        "& .MuiDialog-paper": {
                                            borderRadius: "16px",
                                        },
                                        "& .MuiDialogActions-root": {
                                            borderTop: "1px solid rgba(255,255,255,0.15)",
                                        },
                                    }}
                                >
                                    <DialogActions>
                                        <IconButton onClick={() => setImagePreview(null)} color="primary">
                                           <ClearRoundedIcon/>
                                        </IconButton>
                                    </DialogActions>
                                    <DialogContent>
                                        <img
                                            src={entity[col.id] || "/images/placeholder.png"}
                                            alt="preview"
                                            className="object-contain object-center w-full h-full rounded-lg"
                                        />
                                    </DialogContent>
                                </Dialog>
                                </>
                            ) : (
                                entity[col.id] ?? "—"
                            )}
                        </TableCell>
                    ))}
                </TableRow>

                {/* ── Collapse row ── */}
                {isCollapseRow && collapseColumns?.length > 0 && (
                    <TableRow>
                        <TableCell
                            colSpan={colSpan}
                            sx={{ p: 0, border: open ? "1px solid rgba(255,255,255,0.08)" : "none" }}
                        >
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{
                                    p: 1.5,
                                }}>
                                    <Table size="small" >
                                        <TableBody>
                                            {isCollapseRow && collapseColumns?.length > 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={colSpan}
                                                        sx={{ borderRadius: "16px", border: "none" }}
                                                    >
                                                        <Collapse in={open} timeout="auto" unmountOnExit>
                                                            <Box sx={{background: "rgba(255,255,255,0.04)"}}>
                                                                <Table size="small" >
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            {collapseColumns.map((col) => (
                                                                                <TableCell key={col.id} align={col.align ?? "left"} sx={headerCellSx}>
                                                                                    {col.label}
                                                                                </TableCell>
                                                                            ))}
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {(collapseDataKey ? entity[collapseDataKey] : [])?.map((row, i) => (
                                                                            <TableRow
                                                                                key={i}
                                                                                sx={{
                                                                                    background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent",
                                                                                    "&:hover": { background: "rgba(96,165,250,0.1)" },
                                                                                }}
                                                                            >
                                                                                {collapseColumns.map((col) => (
                                                                                    <TableCell key={col.id} align={col.align ?? "left"} sx={cellSx}>
                                                                                        {col.id === "action" ? (
                                                                                            <Box sx={actionBoxSx}>

                                                                                                {onView && (
                                                                                                    <Tooltip title={tView}>
                                                                                                        <Button onClick={handleView} sx={viewBtnSx}>
                                                                                                            <Visibility sx={{ fontSize: 15 }} />
                                                                                                        </Button>
                                                                                                    </Tooltip>
                                                                                                )}
                                                                                                {onEdit && (
                                                                                                    <Tooltip title={tEdit}>
                                                                                                        <Button onClick={handleEdit} sx={editBtnSx}>
                                                                                                            <Edit sx={{ fontSize: 15 }} />
                                                                                                        </Button>
                                                                                                    </Tooltip>
                                                                                                )}
                                                                                                {isBlocked ? (
                                                                                                    onUnblock && (
                                                                                                        <Tooltip title={tUnblock}>
                                                                                                            <Button onClick={handleUnblock} sx={unblockBtnSx}>
                                                                                                                <KeyIcon fontSize="small" />
                                                                                                            </Button>
                                                                                                        </Tooltip>
                                                                                                    )
                                                                                                ) : (
                                                                                                    onBlock && (
                                                                                                        <Tooltip title={tBlock}>
                                                                                                            <Button onClick={handleBlock} sx={blockBtnSx}>
                                                                                                                <KeyOffIcon fontSize="small" sx={{ color: "#fca5a5" }} />
                                                                                                            </Button>
                                                                                                        </Tooltip>
                                                                                                    )
                                                                                                )}
                                                                                                {onDelete && (
                                                                                                    <Tooltip title={tDelete}>
                                                                                                        <Button onClick={() => handleDeleteSub(row)} sx={deleteBtnSx}>
                                                                                                            <Delete sx={{ fontSize: 15 }} />
                                                                                                        </Button>
                                                                                                    </Tooltip>
                                                                                                )}
                                                                                            </Box>
                                                                                        ) : col.id === "status" ? (
                                                                                            <Box sx={statusBoxSx}>
                                                                                                <Box sx={{ ...baseStatusSx, ...(STATUS_STYLES[row[col.id]?.toUpperCase()] ?? STATUS_DEFAULT) }}>
                                                                                                    {row[col.id] || "—"}
                                                                                                </Box>
                                                                                            </Box>
                                                                                        ) : (
                                                                                            row[col.id] ?? "—"
                                                                                        )}
                                                                                    </TableCell>
                                                                                ))}
                                                                            </TableRow>
                                                                        ))}
                                                                        {/* Empty state inside collapse */}
                                                                        {(!collapseDataKey || !entity[collapseDataKey]?.length) && (
                                                                            <TableRow>
                                                                                <TableCell colSpan={collapseColumns.length} align="center" sx={cellSx}>
                                                                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>
                                                                                        <DataNotFound/>
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                )}
            </>
        );
}

const memoizedRowTable = memo(RowTableComponent);
export default memoizedRowTable;