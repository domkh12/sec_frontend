import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useDeleteBuyerMutation, useUploadBuyerFileMutation,
} from "../../redux/feature/buyer/buyerApiSlice.js";
import {
    setAlertBuyer,setIsOpenDeleteBuyerDialog, setIsOpenSnackbarBuyer,
} from "../../redux/feature/buyer/buyerSlice.js";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import {Alert, Box, Button, Card, InputAdornment, Snackbar, TextField, Typography} from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import {searchTextField} from "../../config/theme.js";
import {Search} from "@mui/icons-material";
import VisuallyHiddenInput from "../../components/input/VisuallyHiddenInput.jsx";
import {useUploadMultipleFileMutation} from "../../redux/feature/file/fileApiSlice.js";

function FileManager() {
    const {t} = useTranslation();
    const {id} = useParams();
    console.log(id)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isOpenSnackbar = useSelector((state) => state.buyer.isOpenSnackbarBuyer);
    const alertBuyer = useSelector((state) => state.buyer.alertBuyer);
    const isOpenDeleteDialog = useSelector((state) => state.buyer.isOpenDeleteBuyerDialog);
    const filterValue = useSelector((state) => state.buyer.filter);
    const [deleteBuyer, {isLoading: isLoadingDeleteBuyer}] = useDeleteBuyerMutation();
    const [uploadMultipleFile, {isLoading: isLoadingUpload}] = useUploadMultipleFileMutation();
    const [uploadBuyerFile, {isLoading: isLoadingUploadBuyerFile}] = useUploadBuyerFileMutation();

    const handleDelete = async () => {
        try {
            const res = await deleteBuyer({id: id}).unwrap();

            dispatch(setIsOpenDeleteBuyerDialog(false));
            dispatch(setAlertBuyer({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarBuyer(true));
        }catch (error) {
            dispatch(setIsOpenDeleteBuyerDialog(false));
            dispatch(setAlertBuyer({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarBuyer(true));
        }
    }

    const handleUpload = async (event) => {
        const files = event.target.files;

        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });
        console.log("Files to upload:", files.length);
        try {
            await uploadMultipleFile(formData).unwrap();
            dispatch(setAlertBuyer({type: "success", message: "Upload successfully"}));
        }catch (e) {
            console.log(e);
        }
    }

    let content = (
        <div className="pb-10">
            <Seo title="Buyer List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin/buyers")}/>
                </div>
                <div className="sub-card-glass">
                    <div className="flex justify-between items-center gap-4">
                        <button className="button-glass">
                            <UploadFileRoundedIcon/>
                            Upload
                        </button>
                        <TextField
                            size="small"
                            placeholder="Search File"
                            variant="outlined"
                            sx={searchTextField}
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
                    </div>
                    <div className="flex justify-between items-center gap-4 mt-4 bg-amber-50 rounded-lg p-4">
                        <div className="flex flex-col items-start gap-2">
                            <Typography variant="h4">There are no file here yet</Typography>
                            <Typography variant="h5">Upload here</Typography>
                            <Button variant="contained" component="label" >
                                <UploadFileRoundedIcon/>
                                Upload
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleUpload}
                                    multiple
                                />
                            </Button>
                        </div>
                        <img src="/images/empty-box-carry.svg" alt="empty-box-carry" className="w-1/5 h-full"/>
                    </div>
                </div>
            </div>

            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarBuyer(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarBuyer(false))}
                    severity={alertBuyer.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertBuyer.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteBuyerDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteBuyer}/>
        </div>
    )

    return content;
}
export default FileManager;