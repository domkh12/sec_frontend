import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isOpenDialogAddOrEditUser: false,
        userDataForUpdate: null,
        isOpenSnackbarUser: false,
        isOpenDeleteUserDialog: false,
        isOpenBlockUserDialog: false,
        idBlockUser: null,
        alertUser: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            role: "",
            status: "",
            department: "",
        },
    },
    reducers: {
        setIdBlockUser: (state, action) => {
            state.idBlockUser = action.payload;
        },
        setIsOpenBlockUserDialog: (state, action) => {
            state.isOpenBlockUserDialog = action.payload;
        },
        setFilterUser: (state, action) => {
            state.filter = action.payload;
        },
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
    setIdBlockUser,
    setIsOpenBlockUserDialog,
    setFilterUser,
    setIsOpenDeleteUserDialog,
    setAlertUser,
    setIsOpenSnackbarUser,
    setUserDataForUpdate,
    setIsOpenDialogAddOrEditUser,
    setPageNoUser,
    setPageSizeUser,
} = userSlice.actions;

export default userSlice.reducer;
