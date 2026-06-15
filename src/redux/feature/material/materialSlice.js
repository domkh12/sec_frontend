import {createSlice} from "@reduxjs/toolkit";

const materialSlice = createSlice({
    name: "material",
    initialState: {
        isOpenDialogAddOrEditMaterial: false,
        materialDataForUpdate: null,
        isOpenSnackbarMaterial: false,
        isOpenSnackbarMaterialStockOut: false,
        isOpenSnackbarMaterialStockIn: false,
        isOpenDeleteMaterialDialog: false,
        alertMaterial: {type: "success", message: ""},
        alertMaterialStockOut: {type: "success", message: ""},
        alertMaterialStockIn: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            status: "",
            color: "",
            size: "",
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
        isOpenEditStockQtyDialog: false,
        isOpenDeleteStockInDialog: false,
        isOpenDeleteStockOutDialog: false,
        stockOutDataForDelete: null,
        stockInDataForDelete: null,
        updateStockQtyData: null,
    },
    reducers: {
        setUpdateStockQtyData: (state, action) => {
            state.updateStockQtyData = action.payload;
        },
        setStockInDataForDelete: (state, action) => {
            state.stockInDataForDelete = action.payload;
        },
        setStockOutDataForDelete: (state, action) => {
            state.stockOutDataForDelete = action.payload;
        },
        setIsOpenDeleteStockOutDialog: (state, action) => {
            state.isOpenDeleteStockOutDialog = action.payload;
        },
        setIsOpenDeleteStockInDialog: (state, action) => {
            state.isOpenDeleteStockInDialog = action.payload;
        },
        setIsOpenEditStockQty: (state, action) => {
            state.isOpenEditStockQtyDialog = action.payload;
        },
        setIsOpenSnackbarMaterialStockIn: (state, action) => {
            state.isOpenSnackbarMaterialStockIn = action.payload;
        },
        setAlertMaterialStockIn: (state, action) => {
            state.alertMaterialStockIn = action.payload;
        },
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
    setUpdateStockQtyData,
    setStockInDataForDelete,
    setStockOutDataForDelete,
    setIsOpenDeleteStockOutDialog,
    setIsOpenDeleteStockInDialog,
    setIsOpenEditStockQty,
    setIsOpenSnackbarMaterialStockIn,
    setAlertMaterialStockIn,
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
