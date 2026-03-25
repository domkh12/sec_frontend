import { useTranslation } from "react-i18next";
import { useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    useDeleteBuyerMutation,
    useGetBuyerFilesQuery,
    useUploadBuyerFileMutation,
} from "../../redux/feature/buyer/buyerApiSlice.js";
import {
    setAlertBuyer,
    setIsOpenDeleteBuyerDialog,
    setIsOpenSnackbarBuyer,
} from "../../redux/feature/buyer/buyerSlice.js";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import { Alert, Snackbar } from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import VisuallyHiddenInput from "../../components/input/VisuallyHiddenInput.jsx";
import { useUploadMultipleFileMutation } from "../../redux/feature/file/fileApiSlice.js";
import EmptyPlaceholderCard from "../../components/card/EmptyPlaceholderCard.jsx";
import ViewToggle from "../../components/button/ViewToggle.jsx";
import {formatFileSize, getFileExtension, IMAGE_EXTS} from "../../redux/feature/util/helper.js";
import * as PropTypes from "prop-types";
import DocCard from "../../components/card/DocCard.jsx";
import ImageCard from "../../components/card/ImageCard.jsx";

function isImage(ext) {
    return IMAGE_EXTS.includes(ext);
}

// ── Upload Progress Bar ────────────────────────────────────────────────────────

function UploadProgressBanner({ isLoading, count }) {
    if (!isLoading) return null;
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "#eff6ff", border: "1.5px solid #bfdbfe",
            borderRadius: 12, padding: "12px 18px", marginBottom: 18,
        }}>
            <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "3px solid #3b82f6", borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite", flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1d4ed8" }}>
                    Uploading {count > 1 ? `${count} files` : "file"}…
                </div>
                <div style={{
                    marginTop: 6, height: 4, borderRadius: 4,
                    background: "#dbeafe", overflow: "hidden",
                }}>
                    <div style={{
                        height: "100%", borderRadius: 4,
                        background: "linear-gradient(90deg, #3b82f6, #6366f1)",
                        animation: "progress 1.5s ease-in-out infinite",
                        width: "60%",
                    }} />
                </div>
            </div>
        </div>
    );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ files }) {
    const counts = files.reduce((acc, url) => {
        const ext = getFileExtension(url);
        if (isImage(ext)) acc.images++;
        else acc.docs++;
        return acc;
    }, { images: 0, docs: 0 });

    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatPill label="Total" value={files.length} color="#6366f1" />
            {counts.images > 0 && <StatPill label="Images" value={counts.images} color="#0ea5e9" />}
            {counts.docs > 0 && <StatPill label="Docs" value={counts.docs} color="#f59e0b" />}
        </div>
    );
}

function StatPill({ label, value, color }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: `${color}11`, border: `1px solid ${color}33`,
            borderRadius: 999, padding: "4px 12px",
        }}>
            <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
        </div>
    );
}

ImageCard.propTypes = {
    url: PropTypes.any,
    fileSize: PropTypes.any
};

function FileManager() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isOpenSnackbar = useSelector((s) => s.buyer.isOpenSnackbarBuyer);
    const alertBuyer = useSelector((s) => s.buyer.alertBuyer);
    const isOpenDeleteDialog = useSelector((s) => s.buyer.isOpenDeleteBuyerDialog);

    const [deleteBuyer, { isLoading: isLoadingDeleteBuyer }] = useDeleteBuyerMutation();
    const [uploadMultipleFile, { isLoading: isLoadingUpload }] = useUploadMultipleFileMutation();
    const [uploadBuyerFile] = useUploadBuyerFileMutation();

    const { data: buyerFiles, isLoading: isLoadingFiles } = useGetBuyerFilesQuery({ id });

    const [search, setSearch] = useState("");
    const [view, setView] = useState("grid");
    const [uploadCount, setUploadCount] = useState(0);

    const files = buyerFiles?.files ?? [];
    const fileSizes = buyerFiles?.fileSizes ?? {};

    const filtered = files.filter((url) =>
        url.toLowerCase().includes(search.toLowerCase())
    );

    // split into images and docs
    const imageFiles = filtered.filter(url => isImage(getFileExtension(url)));
    const docFiles = filtered.filter(url => !isImage(getFileExtension(url)));

    const handleDelete = async () => {
        try {
            await deleteBuyer({ id }).unwrap();
            dispatch(setIsOpenDeleteBuyerDialog(false));
            dispatch(setAlertBuyer({ type: "success", message: "Deleted successfully" }));
            dispatch(setIsOpenSnackbarBuyer(true));
        } catch (error) {
            dispatch(setIsOpenDeleteBuyerDialog(false));
            dispatch(setAlertBuyer({ type: "error", message: error.data?.error?.description ?? "Error" }));
            dispatch(setIsOpenSnackbarBuyer(true));
        }
    };

    const handleUpload = async (event) => {
        const uploadFiles = event.target.files;
        if (!uploadFiles || uploadFiles.length === 0) return;
        setUploadCount(uploadFiles.length);
        const formData = new FormData();
        Array.from(uploadFiles).forEach((f) => formData.append("files", f));
        try {
            const filesUri = [];
            const res = await uploadMultipleFile(formData).unwrap();
            res.forEach(file => filesUri.push(file.uri));
            const mergedFiles = [...(buyerFiles?.files ?? []), ...filesUri];
            await uploadBuyerFile({ id, files: mergedFiles }).unwrap();
            dispatch(setAlertBuyer({ type: "success", message: `${uploadFiles.length} file(s) uploaded successfully` }));
            dispatch(setIsOpenSnackbarBuyer(true));
        } catch (e) {
            dispatch(setAlertBuyer({ type: "error", message: "Upload failed. Please try again." }));
            dispatch(setIsOpenSnackbarBuyer(true));
        } finally {
            setUploadCount(0);
        }
    };

    if (isLoadingFiles) return <LoadingComponent />;

    return (
        <>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }
            `}</style>

            <div className="pb-10">
                <Seo title="File Manager" />

                <div className="card-glass">
                    {/* ── header ── */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <BackButton onClick={() => navigate("/admin/buyers")} />
                        <StatsBar files={files} />
                    </div>

                    <div className="sub-card-glass">
                        {/* ── toolbar ── */}
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", gap: 12, marginBottom: 20,
                            flexWrap: "wrap",
                        }}>
                            {/* search */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 8,
                                background: "#f9fafb", border: "1.5px solid #e5e7eb",
                                borderRadius: 10, padding: "7px 14px",
                                flex: 1, maxWidth: 340,
                            }}>
                                <span style={{ color: "#9ca3af", fontSize: 16 }}>🔍</span>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search files…"
                                    style={{
                                        border: "none", outline: "none",
                                        background: "transparent", fontSize: 13,
                                        color: "#374151", width: "100%",
                                    }}
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} style={{
                                        background: "none", border: "none",
                                        cursor: "pointer", color: "#9ca3af",
                                        fontSize: 14, padding: 0,
                                    }}>✕</button>
                                )}
                            </div>

                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <ViewToggle view={view} onChange={setView} />

                                {/* upload button */}
                                <label style={{
                                    display: "inline-flex", alignItems: "center", gap: 7,
                                    padding: "8px 18px", borderRadius: 10,
                                    background: isLoadingUpload ? "#e5e7eb" : "#111827",
                                    color: isLoadingUpload ? "#9ca3af" : "#fff",
                                    fontWeight: 600, fontSize: 13,
                                    cursor: isLoadingUpload ? "not-allowed" : "pointer",
                                    whiteSpace: "nowrap",
                                    boxShadow: isLoadingUpload ? "none" : "0 2px 8px rgba(0,0,0,0.18)",
                                    transition: "all 0.15s",
                                }}>
                                    {isLoadingUpload ? "⏳ Uploading…" : "⬆ Upload"}
                                    <VisuallyHiddenInput
                                        type="file" onChange={handleUpload} multiple disabled={isLoadingUpload} />
                                </label>
                            </div>
                        </div>

                        {/* upload progress */}
                        <UploadProgressBanner isLoading={isLoadingUpload} count={uploadCount} />

                        {/* ── content ── */}
                        {/* When no files at all: show placeholder card in the grid */}
                        {files.length === 0 ? (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: 12,
                            }}>
                                <EmptyPlaceholderCard onUpload={handleUpload} isLoading={isLoadingUpload} />
                            </div>
                        ) : filtered.length === 0 && search ? (
                            <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                                No files match "<strong>{search}</strong>"
                            </div>
                        ) : (
                            <div>
                                {/* Images section */}
                                {imageFiles.length > 0 && (
                                    <div style={{ marginBottom: 28 }}>
                                        <SectionHeader label="Images" count={imageFiles.length} color="#0ea5e9" />
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: view === "grid"
                                                ? "repeat(auto-fill, minmax(200px, 1fr))"
                                                : "1fr",
                                            gap: view === "grid" ? 12 : 8,
                                        }}>
                                            {imageFiles.map((url) =>
                                                view === "grid" ? (
                                                    <ImageCard key={url} url={url} fileSize={fileSizes?.[url] ? formatFileSize(fileSizes[url]) : null} />
                                                ) : (
                                                    <DocCard key={url} url={url} fileSize={fileSizes?.[url] ? formatFileSize(fileSizes[url]) : null} />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Documents section */}
                                {docFiles.length > 0 && (
                                    <div>
                                        <SectionHeader label="Documents" count={docFiles.length} color="#f59e0b" />
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: view === "grid"
                                                ? "repeat(auto-fill, minmax(280px, 1fr))"
                                                : "1fr",
                                            gap: view === "list" ? 8 : 12,
                                        }}>
                                            {docFiles.map((url) => (
                                                <DocCard key={url} url={url} fileSize={fileSizes?.[url] ? formatFileSize(fileSizes[url]) : null} />
                                            ))}
                                        </div>
                                    </div>
                                )}


                            </div>
                        )}
                    </div>
                </div>

                {/* ── snackbar ── */}
                <Snackbar
                    open={isOpenSnackbar}
                    autoHideDuration={6000}
                    onClose={() => dispatch(setIsOpenSnackbarBuyer(false))}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert
                        onClose={() => dispatch(setIsOpenSnackbarBuyer(false))}
                        severity={alertBuyer.type}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {alertBuyer.message}
                    </Alert>
                </Snackbar>

                <DialogConfirmDelete
                    isOpen={isOpenDeleteDialog}
                    onClose={() => dispatch(setIsOpenDeleteBuyerDialog(false))}
                    handleDelete={handleDelete}
                    isSubmitting={isLoadingDeleteBuyer}
                />
            </div>
        </>
    );
}

function SectionHeader({ label, count, color }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
        }}>
            <span style={{
                fontSize: 13, fontWeight: 700, color: "#374151", letterSpacing: 0.3,
            }}>{label}</span>
            <span style={{
                fontSize: 11, fontWeight: 700, color,
                background: `${color}15`, borderRadius: 999,
                padding: "1px 8px", border: `1px solid ${color}30`,
            }}>{count}</span>
            <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
        </div>
    );
}

export default FileManager;