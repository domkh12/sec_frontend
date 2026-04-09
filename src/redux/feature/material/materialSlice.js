import {createSlice} from "@reduxjs/toolkit";

const materialSlice = createSlice({
    name: "material",
    initialState: {
        isOpenDialogAddOrEditMaterial: false,
        materialDataForUpdate: null,
        isOpenSnackbarMaterial: false,
        isOpenSnackbarMaterialStockOut: false,
        isOpenDeleteMaterialDialog: false,
        alertMaterial: {type: "success", message: ""},
        alertMaterialStockOut: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            status: "",
        },
        filterStockIn: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        },
        filterStockOut: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        },
        isFullScreenDialogStockIn: false,
        isFullScreenDialogStockOut: false,
        stockInData: null,
        stockOutData: null,
    },
    reducers: {
        setStockOutData: (state, action) => {
            state.stockOutData = action.payload;
        },
        setFilterStockOut: (state, action) => {
            state.filterStockOut = action.payload;
        },
        setFilterStockIn: (state, action) => {
            state.filterStockIn = action.payload;
        },
        setStockInData: (state, action) => {
            state.stockInData = action.payload;
        },
        setIsFullScreenDialogStockOut: (state, action) => {
            state.isFullScreenDialogStockOut = action.payload;
        },
        setIsFullScreenDialogStockIn: (state, action) => {
            state.isFullScreenDialogStockIn = action.payload;
        },
        setFilterMaterial: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteMaterialDialog: (state, action) => {
            state.isOpenDeleteMaterialDialog = action.payload;
        },
        setAlertMaterial: (state, action) => {
            state.alertMaterial = action.payload;
        },
        setAlertMaterialStockOut: (state, action) => {
            state.alertMaterialStockOut = action.payload;
        },
        setIsOpenSnackbarMaterial: (state, action) => {
            state.isOpenSnackbarMaterial = action.payload;
        },
        setIsOpenSnackbarMaterialStockOut: (state, action) => {
            state.isOpenSnackbarMaterialStockOut = action.payload;
        },
        setMaterialDataForUpdate: (state, action) => {
            state.materialDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditMaterial: (state, action) => {
            state.isOpenDialogAddOrEditMaterial = action.payload;
        }
    },
});

export const {
    setAlertMaterialStockOut,
    setIsOpenSnackbarMaterialStockOut,
    setStockOutData,
    setFilterStockOut,
    setFilterStockIn,
    setStockInData,
    setIsFullScreenDialogStockOut,
    setIsFullScreenDialogStockIn,
    setFilterMaterial,
    setIsOpenDeleteMaterialDialog,
    setAlertMaterial,
    setIsOpenSnackbarMaterial,
    setMaterialDataForUpdate,
    setIsOpenDialogAddOrEditMaterial
} = materialSlice.actions;

export default materialSlice.reducer;
