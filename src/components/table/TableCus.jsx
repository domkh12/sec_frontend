import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    Tooltip,
    Box, Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import DataNotFound from "../error/DataNotFound.jsx";

function TableCus({ columns, data, handleChangePage, handleChangeRowsPerPage, onEdit, onView, onDelete }) {
    const { t } = useTranslation();
    const { ids, entities, totalElements, pageSize, pageNo } = data;

    let tableContent;

    tableContent = (
        <>
            {ids.length ? (
                ids.map((id) => (
                    <TableRow key={id}>
                        {columns.map((col) => (
                            <TableCell
                                key={col.id}
                                align={col.align}
                                style={{ minWidth: col.minWidth }}
                                sx={{ border: "1px solid #ccc", textAlign: "center", color: "white" }}
                            >
                                {col.id === "action" ? (
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                        {onView && (
                                            <Tooltip title={t("table.view")}>
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    onClick={() => onView(entities[id])}
                                                    sx={{ minWidth: 0, width: 36, height: 36, padding: 0 }}
                                                >
                                                    <Visibility fontSize="small" />
                                                </Button>
                                            </Tooltip>
                                        )}
                                        {onEdit && (
                                            <Tooltip title={t("table.edit")}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => onEdit(entities[id])}
                                                    sx={{ minWidth: 0, width: 36, height: 36, padding: 0 }}
                                                >
                                                    <Edit fontSize="small" />
                                                </Button>
                                            </Tooltip>
                                        )}
                                        {onDelete && (
                                            <Tooltip title={t("table.delete")}>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => onDelete(entities[id])}
                                                    sx={{ minWidth: 0, width: 36, height: 36, padding: 0 }}
                                                >
                                                    <Delete fontSize="small" />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </Box>
                                ) : (
                                    entities[id][col.id] || `—`
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell align="center" colSpan={columns.length}>
                        <DataNotFound />
                    </TableCell>
                </TableRow>
            )}
        </>
    );

    return (
        <div className="rounded-xl overflow-hidden">
            <TableContainer sx={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns?.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        fontWeight: 600,
                                        border: "1px solid #ccc",
                                        padding: "10px",
                                        backgroundColor: "#f5f5f5",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        height: "50px",
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
                sx={{
                    border: "1px solid #ccc",
                    borderEndStartRadius: "12px",
                    borderEndEndRadius: "12px",
                    borderTop: "none",
                    color: "white",
                    "& .MuiTablePagination-actions button": {
                        color: "white",
                    },
                    "& .MuiTablePagination-actions button.Mui-disabled": {
                        color: "white",
                    },
                    "& .MuiSelect-icon": {
                        color: "white",
                    },
                }}
                rowsPerPageOptions={[20, 50, 100]}
                component="div"
                count={totalElements || 0}
                rowsPerPage={pageSize}
                labelRowsPerPage={t("table.rowPerPage")}
                page={pageNo}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

export default TableCus;