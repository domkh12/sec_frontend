import {createSlice} from "@reduxjs/toolkit";

const roleSlice = createSlice({
    name: "role",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditRole: false,
        roleDataForUpdate: null,
        isOpenSnackbarRole: false,
        isOpenDeleteRoleDialog: false,
        alertRole: {type: "success", message: ""}

    },
    reducers: {
        setIsOpenDeleteRoleDialog: (state, action) => {
            state.isOpenDeleteRoleDialog = action.payload;
        },
        setAlertRole: (state, action) => {
            state.alertRole = action.payload;
        },
        setIsOpenSnackbarRole: (state, action) => {
            state.isOpenSnackbarRole = action.payload;
        },
        setRoleDataForUpdate: (state, action) => {
            state.roleDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditRole: (state, action) => {
            state.isOpenDialogAddOrEditRole = action.payload;
        },
        setPageNoRole: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeRole: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setIsOpenDeleteRoleDialog,
    setAlertRole,
    setIsOpenSnackbarRole,
    setRoleDataForUpdate,
    setIsOpenDialogAddOrEditRole,
    setPageNoRole,
    setPageSizeRole,
} = roleSlice.actions;

export default roleSlice.reducer;
