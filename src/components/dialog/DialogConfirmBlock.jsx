import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function DialogConfirmBlock({
                                isOpen = false,
                                onClose,
                                title,
                                handleBlock,
                                isSubmitting = false,
                                isBlocked = false  // To determine if we're blocking or unblocking
                            }) {
    const { t } = useTranslation();

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            transitionDuration={{ enter: 280, exit: 150 }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(2,6,23,0.55)",
                    },
                },
            }}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "18px",
                    width: "380px",
                    padding: "6px",
                    background: "rgba(15,23,42,1)",
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
            {/* Icon - changes based on block/unblock */}
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
                    background: isBlocked
                        ? "rgba(34,197,94,0.15)"  // Green for unblock
                        : "rgba(251,191,36,0.15)", // Amber for block
                    border: isBlocked
                        ? "1px solid rgba(34,197,94,0.3)"
                        : "1px solid rgba(251,191,36,0.3)",
                    boxShadow: isBlocked
                        ? "0 0 20px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
                        : "0 0 20px rgba(251,191,36,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {isBlocked ? (
                        // Checkmark icon for unblock
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M9 12l2 2 4-4"
                                stroke="rgba(134,239,172,0.9)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="rgba(134,239,172,0.9)"
                                strokeWidth="1.8"
                            />
                        </svg>
                    ) : (
                        // Lock icon for block
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                                stroke="rgba(251,191,36,0.9)"
                                strokeWidth="1.8"
                            />
                            <path
                                d="M7 11V7a5 5 0 0 1 10 0v4"
                                stroke="rgba(251,191,36,0.9)"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
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
                {isBlocked ? t("user.unblock") : t("user.block")} {title}?
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
                    {isBlocked
                        ? t("user.unblock.description") || "This user will be able to access the system again."
                        : t("user.block.description") || "This user will not be able to access the system."
                    }
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
                    disabled={isSubmitting}
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
                    {t("buttons.cancel")}
                </Button>
                <Button
                    onClick={handleBlock}
                    disabled={isSubmitting}
                    variant="contained"
                    size="small"
                    sx={{
                        flex: 1,
                        borderRadius: "9px",
                        background: isBlocked
                            ? "linear-gradient(135deg, rgba(34,197,94,0.8) 0%, rgba(22,163,74,0.75) 100%)"
                            : "linear-gradient(135deg, rgba(251,191,36,0.8) 0%, rgba(245,158,11,0.75) 100%)",
                        border: isBlocked
                            ? "1px solid rgba(134,239,172,0.25)"
                            : "1px solid rgba(251,191,36,0.25)",
                        boxShadow: isBlocked
                            ? "0 4px 16px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
                            : "0 4px 16px rgba(251,191,36,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.95)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                            background: isBlocked
                                ? "linear-gradient(135deg, rgba(34,197,94,0.95) 0%, rgba(22,163,74,0.9) 100%)"
                                : "linear-gradient(135deg, rgba(251,191,36,0.95) 0%, rgba(245,158,11,0.9) 100%)",
                            boxShadow: isBlocked
                                ? "0 6px 20px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.2)"
                                : "0 6px 20px rgba(251,191,36,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                            transform: "translateY(-1px)",
                        },
                        "&.Mui-disabled": {
                            background: isBlocked
                                ? "linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(22,163,74,0.35) 100%)"
                                : "linear-gradient(135deg, rgba(251,191,36,0.4) 0%, rgba(245,158,11,0.35) 100%)",
                            color: "rgba(255,255,255,0.45)",
                        },
                        transition: "all 0.18s ease",
                    }}
                >
                    <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ visibility: isSubmitting ? "hidden" : "visible" }}>
                            {isBlocked
                                ? `✓ ${t("user.unblock.confirm") || "Yes, Unblock"}`
                                : `🔒 ${t("user.block.confirm") || "Yes, Block"}`
                            }
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

export default DialogConfirmBlock;