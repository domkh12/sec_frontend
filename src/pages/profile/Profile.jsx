import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { t } from "i18next";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {Button, Stack, Typography, Box, Avatar, Divider, TextField, Snackbar, Alert} from "@mui/material";
import CardGlassBlur2 from "../../components/ui/CardGlassBlur2.jsx";
import InputFileUpload from "../../components/ui/InputFileUpload.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import {useUpdateUserProfileMutation } from "../../redux/feature/auth/authApiSlice.js";
import {setAlertProfile, setIsOpenSnackbarProfile} from "../../redux/feature/auth/authSlice.js";
import useFileUpload from "../../hook/useFileUpload.jsx";
import useAuth from "../../hook/useAuth.jsx";
import Seo from "../../components/seo/Seo.jsx";
import CustomTextField1 from "../../components/input/CustomTextField1.jsx";

// ── Validation Schema ──────────────────────────────────────────────────────────
const validationSchema = Yup.object({
    firstName: Yup.string().required(t("validation.required")),
    lastName:  Yup.string().required(t("validation.required")),
    phone:     Yup.string().matches(/^\+?[0-9\s\-()]{7,20}$/, t("validation.invalidPhone")),
    birthday: Yup.mixed()
        .nullable()
        .test("valid-date", t("validation.invalidDate"), (val) =>
            val === null || dayjs(val).isValid()
        ),
});

// ── Shared MUI TextField style ─────────────────────────────────────────────────
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
        "&:hover fieldset": { borderColor: "rgba(6,182,212,0.4)" },
        "&.Mui-focused fieldset": { borderColor: "rgba(6,182,212,0.6)" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)", fontSize: 12 },
    "& .MuiInputLabel-root.Mui-focused": { color: "rgb(6,182,212)" },
    "& .MuiOutlinedInput-input": { color: "#e2e8f0", fontSize: 14 },
    "& .MuiFormHelperText-root": { color: "#f87171" },
};

// ── Component ──────────────────────────────────────────────────────────────────
function Profile() {
    const user     = useSelector((state) => state.auth.profile);
    const {isManager, isAdmin, isWarehouse} = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isOpenSnackbar = useSelector((state) => state.auth.isOpenSnackbarProfile);
    const alertProfile = useSelector((state) => state.auth.alert);
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
    const {upload, isLoading: isLoadingUpload} = useFileUpload();
    const initialValues = {
        firstName: user.firstName   ?? "",
        lastName:  user.lastName    ?? "",
        phone:     user.phoneNumber ?? "",
        birthday:  user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
    };

    const handleSubmit = async (values) => {
        try {
            await updateProfile({
                firstName:   values.firstName,
                lastName:    values.lastName,
                phoneNumber: values.phone,
                dateOfBirth: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,  // format before sending
            }).unwrap();
            dispatch(setAlertProfile({type: "success", message: "Update successfully"}));
            dispatch(setIsOpenSnackbarProfile(true));
        } catch (err) {
            console.error("Error updating profile:", err);
            dispatch(setAlertProfile({type: "error", message: err.data.error.description}));
            dispatch(setIsOpenSnackbarProfile(true));
        }
    };

    const handleUploadImage = async (event) => {
        console.log("Uploading file:", event.target.files[0]);
        try {
            await upload(event, (onError) => {
                console.error("Error uploading file:", onError);
                dispatch(setAlertProfile({type: "error", message: onError}));
                dispatch(setIsOpenSnackbarProfile(true));
            }, async (onSuccess) =>{
                await updateProfile({ avatar: onSuccess.uri }).unwrap();
                dispatch(setAlertProfile({type: "success", message: "Update successfully"}));
                dispatch(setIsOpenSnackbarProfile(true));
            })

        }catch (err) {
            console.error("Error uploading file:", err);
        }
    }

    const handleRemoveImage = async () => {
        try {
            await updateProfile({ avatar: "" }).unwrap();
            dispatch(setAlertProfile({type: "success", message: "Update successfully"}));
            dispatch(setIsOpenSnackbarProfile(true));
        }catch (err) {
            console.error("Error removing image:", err);
        }
    }

    const navigateToHome = () => {
        if (isAdmin) navigate("/admin");
        else if (isManager) navigate("/manager");
        else if (isWarehouse) navigate("/warehouse");
        else if (isViewer) navigate("/tv");
    }

    return (
        <div className="card-glass text-amber-50">
            <Seo title="Profile" />
            <BackButton onClick={navigateToHome} />
            <p className="text-2xl font-bold my-5">Account Settings</p>
            <div className="w-full flex gap-4 justify-start items-start">
                <div className=" flex flex-col gap-4 mt-5 justify-start items-start">
                    <button className="button-glass" style={{ width: "200px", textAlign: "left", margin: 0 }}>
                        My profile
                    </button>
                    <button className="hover:button-glass">
                        Security
                    </button>
                    <button>
                        Notifications
                    </button>
                    <button>
                        Help
                    </button>
                </div>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                <div className="w-full">
                    <div className="w-full">
                        <div className="flex gap-5 justify-baseline items-center">
                            <img src={user.avatar || "/images/default-avatar.png"} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
                            <div className="">
                                <p>Profile picture</p><br/>
                                <p>PNG, JPG under 2MB</p>
                                <div className="flex gap-5 mt-5">
                                    <button className="hover:underline text-blue-400 cursor-pointer">Upload new picture</button>
                                    <button className="hover:underline text-red-500 cursor-pointer">Delete</button>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="mb-5">Full name</p>

                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            sx={{ 
                                width: "100%",
                             }}
                        >
                            <Form>
                                <div className="w-full grid grid-cols-2 gap-5">
                                    <div>
                                        <p>Name Khmer</p>
                                        <CustomTextField1 name="firstName" value={user.nameKh}/>
                                    </div>
                                    <div>
                                        <p>Name English</p>
                                        <CustomTextField1 name="lastName" value={user.nameEn}/>
                                    </div>
                                </div>
                                
                            </Form>
                        </Formik>
                    </div>    
                </div>
            </div>
        </div>
    );
}

export default Profile;