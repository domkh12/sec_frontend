import {createSlice} from "@reduxjs/toolkit";

const productionlineSlice = createSlice({
    name: "productionline",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditProductionLine: false,
        productionlineDataForUpdate: null,
        isOpenSnackbarProductionLine: false,
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
        setIsOpenSnackbarProductionLine: (state, action) => {
            state.isOpenSnackbarProductionLine = action.payload;
        },
        setProductionLineDataForUpdate: (state, action) => {
            state.productionlineDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditProductionLine: (state, action) => {
            state.isOpenDialogAddOrEditProductionLine = action.payload;
        },
        setPageNoProductionLine: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeProductionLine: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setIsOpenDeleteDeptDialog,
    setAlertDept,
    setIsOpenSnackbarProductionLine,
    setProductionLineDataForUpdate,
    setIsOpenDialogAddOrEditProductionLine,
    setPageNoProductionLine,
    setPageSizeProductionLine,
} = productionlineSlice.actions;

export default productionlineSlice.reducer;
