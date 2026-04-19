import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {useLoginMutation} from "../../redux/feature/auth/authApiSlice.js";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {ROLES} from "../../config/roles.js";
import {jwtDecode} from "jwt-decode";
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import {Alert, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {useEffect, useState} from "react";
import useLocalStorage from "../../hook/useLocalStorage.jsx";
import usePersist from "../../hook/usePersist.jsx";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";

function Login() {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [persist, setPersist] = usePersist();
    const [login, {isSuccess, isLoading}] = useLoginMutation();

    const [authData, setAuthData] = useLocalStorage('authData', {
        isRemember: false,
        userRoles: "",
        username: null,
    });

    const saveLoginInfo = (roles, username) => {
        setAuthData({
            isRemember: true,
            userRoles: roles[0],
            username,
        });
    };

    useEffect(() => {
        if (errorMsg?.length !== 0){
            setTimeout(() => {
                setErrorMsg("");
            },3000)
        }
    }, [errorMsg])

    useEffect(() => {
        const checkRememberedLogin = () => {
            if (authData.isRemember && authData.userRoles !== "") {
                if (authData.userRoles === "ROLE_ADMIN") {
                    navigate("/admin");
                } else if (authData.userRoles === "ROLE_MANAGER") {
                    navigate("/manager");
                } else if (authData.userRoles === "ROLE_VIEWER") {
                    navigate("/tv");
                }
            }
        };
        checkRememberedLogin();
    }, []);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(("Username is required")),
        password: Yup.string().required(("Password is required"))
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (values, {setSubmitting, resetForm}) => {
        try {
            setPersist(true);
            const {accessToken} = await login({
                username: values.username,
                password: values.password,
            }).unwrap();


                const decoded = jwtDecode(accessToken);
                const {jti: username, scope} = decoded;

                const roles = scope ? scope.split(" ") : [];
                console.log(roles)
                if (roles.includes(ROLES.ROLE_MANAGER)) {
                    try {
                        navigate("/manager");
                        saveLoginInfo(roles, username);
                    } catch (err) {
                        console.log(err);
                    }
                } else if (roles.includes(ROLES.ROLE_ADMIN)) {
                    try {
                        navigate("/admin");
                        saveLoginInfo(roles, username);
                    } catch (err) {
                        console.log(err);
                    }
                } else if (roles.includes(ROLES.ROLE_VIEWER)) {
                    try {
                        navigate("/tv");
                        saveLoginInfo(roles, username);
                    } catch (err) {
                        console.log(err);
                    }
                }

        } catch (error) {
            console.log(error);
            if (error.status === "FETCH_ERROR"){
                setErrorMsg("Server is not responding!");
            }else if (error.status === 500) {
                setErrorMsg("Something went wrong!");
            } else if (error.status === 400) {
                setErrorMsg("Email or Password is incorrect.");
            } else if (error.status === 404) {
                setErrorMsg("Email or Password is incorrect.");
            } else if (error.status === 401) {
                setErrorMsg("Email or Password is incorrect.");
            } else {
                setErrorMsg(error?.data?.error?.description);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            className="bg-main"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f0f2f5",
                position: "relative",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    width: "100%",
                    maxWidth: 500,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: 2,
                    boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                }}
            >
                {/* Logo */}
                <img src="/images/sec_logo.png" alt="sec_logo" className="mb-8 w-28 h-full"/>
                <Formik  initialValues={{username: "", password: ""}}
                         validationSchema={validationSchema}
                         onSubmit={handleSubmit}
                >
                    {({values, touched, errors, handleChange, handleBlur})=> (
                        <Form>
                            {errorMsg?.length !== 0 && (<Alert sx={{mb:2}} severity="error">{errorMsg}</Alert>)}
                            {/* Username */}
                            <TextField
                                label="Username"
                                variant="outlined"
                                id="username"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ mb: 2 }}
                                error={errors.username && touched.username}
                                helperText={
                                    errors.username && touched.username ? errors.username : null
                                }
                            />

                            {/* Password */}
                            <FormControl
                                sx={{width: "100%", mb: 2, mt: 1}}
                                variant="outlined"
                                size="small"
                                error={errors.password && touched.password}
                            >
                                <InputLabel htmlFor="password">
                                    {"Password"}
                                </InputLabel>
                                <OutlinedInput
                                    sx={{
                                        "& .MuiInputBase-input": {
                                            boxShadow: "none",
                                        },
                                        borderRadius: "6px",
                                    }}
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    autoComplete="new-password"
                                    value={values.password}
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword
                                                        ? "hide the password"
                                                        : "display the password"
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityTwoToneIcon/> : <VisibilityOffTwoToneIcon/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                                <FormHelperText>
                                    {errors.password && touched.password
                                        ? errors.password
                                        : null}
                                </FormHelperText>
                            </FormControl>

                            {/* Login Button */}
                            <Button
                                loading={isLoading}
                                variant="contained"
                                type="submit"
                                fullWidth
                                size="medium"
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                            >
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}

export default Login;