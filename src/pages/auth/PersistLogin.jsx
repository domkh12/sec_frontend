import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/feature/auth/authSlice";
import { useRefreshMutation } from "../../redux/feature/auth/authApiSlice";
import { Outlet } from "react-router-dom";
import usePersist from "../../hook/usePersist";
import {Paper} from "@mui/material";
import Unauthorize from "../error/Unauthorize.jsx";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";

function PersistLogin() {
    const [persist, setPersist] = usePersist();

    const token = useSelector(selectCurrentToken);
    const [trueSuccess, setTrueSuccess] = useState(false);
    const effectRan = useRef(false);
    const [refresh, { isUninitialized, isSuccess, isLoading, isError, error }] =
        useRefreshMutation();
    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== "development") {
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                    setTrueSuccess(true);
                } catch (error) {
                    console.log(error);
                }
            };

            if (!token) verifyRefreshToken();
        }

        return () => (effectRan.current = true);
    }, []);

    let content;
    if (!persist) {
        // persist: no
        content = <Paper><Outlet /></Paper>;
    } else if(isLoading){
        // content = <LoadingOneComponent />;
        content = (<LoadingComponent/>)
    } else if (isError) {
        localStorage.removeItem("isRemember");
        // content = <Error401Component />;
        content = <Unauthorize/>
    } else if (isSuccess && trueSuccess) {
        // persist: yes , token: yes
        content =  <Paper><Outlet /></Paper>;
    } else if (token && isUninitialized) {
        content = <Paper><Outlet /></Paper>;
    }

    return content;
}

export default PersistLogin;