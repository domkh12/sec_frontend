import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
} from "@mui/material";

function DialogConfirmDelete({ isOpen = false, onClose, title, handleDelete, isSubmitting = false }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            transitionDuration={{ enter: 280, exit: 150 }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(2,6,23,0.55)",
                        backdropFilter: "blur(6px)",
                    },
                },
            }}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "18px",
                    width: "380px",
                    padding: "6px",
                    background: "rgba(15,23,42,0.55)",
                    backdropFilter: "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.18),
                        inset 0 -1px 0 rgba(255,255,255,0.05),
                        0 32px 80px rgba(0,0,0,0.55),
                        0 8px 24px rgba(0,0,0,0.3)
                    `,
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "10%",
                        right: "10%",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                    },
                },
            }}
        >
            {/* Red warning icon */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "24px",
                paddingBottom: "4px",
            }}>
                <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    boxShadow: "0 0 20px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                            stroke="rgba(252,165,165,0.9)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10 11v4M14 11v4"
                            stroke="rgba(252,165,165,0.9)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>

            <DialogTitle
                sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.92)",
                    textAlign: "center",
                    pb: 0.5,
                    pt: 1.5,
                    letterSpacing: "0.01em",
                }}
            >
                Delete {title}?
            </DialogTitle>

            <DialogContent sx={{ pb: 1, pt: 0.5 }}>
                <DialogContentText
                    sx={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "0.82rem",
                        textAlign: "center",
                        lineHeight: 1.6,
                    }}
                >
                    Once deleted, you cannot get it back.
                </DialogContentText>
            </DialogContent>

            {/* Divider */}
            <div style={{
                margin: "4px 20px 12px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            }} />

            <DialogActions sx={{ pb: 2, px: 2.5, gap: 1, justifyContent: "center" }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    size="small"
                    sx={{
                        flex: 1,
                        borderRadius: "9px",
                        borderColor: "rgba(255,255,255,0.2)",
                        color: "rgba(255,255,255,0.65)",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                            borderColor: "rgba(255,255,255,0.38)",
                            backgroundColor: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.85)",
                        },
                    }}
                >
                    No, Keep It
                </Button>
                <Button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    variant="contained"
                    size="small"
                    sx={{
                        flex: 1,
                        borderRadius: "9px",
                        background: "linear-gradient(135deg, rgba(239,68,68,0.8) 0%, rgba(220,38,38,0.75) 100%)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(252,165,165,0.25)",
                        boxShadow: "0 4px 16px rgba(239,68,68,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.95)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                            background: "linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(220,38,38,0.9) 100%)",
                            boxShadow: "0 6px 20px rgba(239,68,68,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                            transform: "translateY(-1px)",
                        },
                        "&.Mui-disabled": {
                            background: "linear-gradient(135deg, rgba(239,68,68,0.4) 0%, rgba(220,38,38,0.35) 100%)",
                            color: "rgba(255,255,255,0.45)",
                        },
                        transition: "all 0.18s ease",
                    }}
                >
                    <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ visibility: isSubmitting ? "hidden" : "visible" }}>
                            Yes, Delete
                        </span>
                        {isSubmitting && (
                            <CircularProgress
                                size={14}
                                sx={{
                                    color: "rgba(255,255,255,0.7)",
                                    position: "absolute",
                                }}
                            />
                        )}
                    </span>
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogConfirmDelete;