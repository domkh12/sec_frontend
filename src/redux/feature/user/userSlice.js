import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditUser: false,
        userDataForUpdate: null,
        isOpenSnackbarUser: false,
        isOpenDeleteUserDialog: false,
        alertUser: {type: "success", message: ""}

    },
    reducers: {
        setIsOpenDeleteUserDialog: (state, action) => {
            state.isOpenDeleteUserDialog = action.payload;
        },
        setAlertUser: (state, action) => {
            state.alertUser = action.payload;
        },
        setIsOpenSnackbarUser: (state, action) => {
            state.isOpenSnackbarUser = action.payload;
        },
        setUserDataForUpdate: (state, action) => {
            state.userDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditUser: (state, action) => {
            state.isOpenDialogAddOrEditUser = action.payload;
        },
        setPageNoUser: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeUser: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setIsOpenDeleteUserDialog,
    setAlertUser,
    setIsOpenSnackbarUser,
    setUserDataForUpdate,
    setIsOpenDialogAddOrEditUser,
    setPageNoUser,
    setPageSizeUser,
} = userSlice.actions;

export default userSlice.reducer;
