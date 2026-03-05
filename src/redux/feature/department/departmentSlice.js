import {createSlice} from "@reduxjs/toolkit";

const departmentSlice = createSlice({
    name: "department",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditDepartment: false,
        departmentDataForUpdate: null,
        isOpenSnackbarDepartment: false,
        isOpenDeleteDeptDialog: false,
        alertDept: {type: "success", message: ""}

    },
    reducers: {
        setIsOpenDeleteDeptDialog: (state, action) => {
            state.isOpenDeleteDeptDialog = action.payload;
        },
        setAlertDept: (state, action) => {
            state.alertDept = action.payload;
        },
        setIsOpenSnackbarDepartment: (state, action) => {
            state.isOpenSnackbarDepartment = action.payload;
        },
        setDepartmentDataForUpdate: (state, action) => {
            state.departmentDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditDepartment: (state, action) => {
            state.isOpenDialogAddOrEditDepartment = action.payload;
        },
        setPageNoDepartment: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeDepartment: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setIsOpenDeleteDeptDialog,
    setAlertDept,
    setIsOpenSnackbarDepartment,
    setDepartmentDataForUpdate,
    setIsOpenDialogAddOrEditDepartment,
    setPageNoDepartment,
    setPageSizeDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;
