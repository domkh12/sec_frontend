import { Outlet } from "react-router-dom";
import {Paper} from "@mui/material";
import {useGetUserProfileQuery} from "../../redux/feature/auth/authApiSlice.js";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setProfile} from "../../redux/feature/auth/authSlice.js";

function Prefetch() {
    const dispatch = useDispatch();
    const {data: profileData} = useGetUserProfileQuery();
    useEffect(() => {
        if (profileData) {
            dispatch(setProfile(profileData));
        }
    }, [dispatch, profileData]);
    return <Paper elevation={0}><Outlet /></Paper>;
}

export default Prefetch;