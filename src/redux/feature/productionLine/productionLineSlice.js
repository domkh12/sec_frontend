import {createSlice} from "@reduxjs/toolkit";

const productionLineSlice = createSlice({
    name: "production:ine",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditProductionLine: false,
        productionLineDataForUpdate: null,
        isOpenSnackbarProductionLine: false,
        isOpenDeleteDeptDialog: false,
        alertProductionLine: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            department: "",
        }
    },
    reducers: {
        setFilterProductionLine: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteDeptDialog: (state, action) => {
            state.isOpenDeleteDeptDialog = action.payload;
        },
        setAlertProductionLine: (state, action) => {
            state.alertProductionLine = action.payload;
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
    setFilterProductionLine,
    setIsOpenDeleteDeptDialog,
    setAlertProductionLine,
    setIsOpenSnackbarProductionLine,
    setProductionLineDataForUpdate,
    setIsOpenDialogAddOrEditProductionLine,
    setPageNoProductionLine,
    setPageSizeProductionLine,
} = productionLineSlice.actions;

export default productionLineSlice.reducer;
