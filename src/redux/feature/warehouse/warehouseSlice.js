import {createSlice} from "@reduxjs/toolkit";

const warehouseSlice = createSlice({
    name: "warehouse",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditWarehouse: false,
        warehouseDataForUpdate: null,
        isOpenSnackbarWarehouse: false,
        isOpenDeleteWarehouseDialog: false,
        alertWarehouse: {type: "success", message: ""},
        filter:{
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterWarehouse: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteWarehouseDialog: (state, action) => {
            state.isOpenDeleteWarehouseDialog = action.payload;
        },
        setAlertWarehouse: (state, action) => {
            state.alertWarehouse = action.payload;
        },
        setIsOpenSnackbarWarehouse: (state, action) => {
            state.isOpenSnackbarWarehouse = action.payload;
        },
        setWarehouseDataForUpdate: (state, action) => {
            state.warehouseDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditWarehouse: (state, action) => {
            state.isOpenDialogAddOrEditWarehouse = action.payload;
        },
        setPageNoWarehouse: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeWarehouse: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterWarehouse,
    setIsOpenDeleteWarehouseDialog,
    setAlertWarehouse,
    setIsOpenSnackbarWarehouse,
    setWarehouseDataForUpdate,
    setIsOpenDialogAddOrEditWarehouse,
    setPageNoWarehouse,
    setPageSizeWarehouse,
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
