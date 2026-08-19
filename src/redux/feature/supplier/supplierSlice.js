import {createSlice} from "@reduxjs/toolkit";

const supplierSlice = createSlice({
    name: "supplier",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditSupplier: false,
        supplierDataForUpdate: null,
        isOpenSnackbarSupplier: false,
        isOpenDeleteSupplierDialog: false,
        alertSupplier: {type: "success", message: ""},
        filter:{
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterSupplier: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteSupplierDialog: (state, action) => {
            state.isOpenDeleteSupplierDialog = action.payload;
        },
        setAlertSupplier: (state, action) => {
            state.alertSupplier = action.payload;
        },
        setIsOpenSnackbarSupplier: (state, action) => {
            state.isOpenSnackbarSupplier = action.payload;
        },
        setSupplierDataForUpdate: (state, action) => {
            state.supplierDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditSupplier: (state, action) => {
            state.isOpenDialogAddOrEditSupplier = action.payload;
        },
        setPageNoSupplier: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeSupplier: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterSupplier,
    setIsOpenDeleteSupplierDialog,
    setAlertSupplier,
    setIsOpenSnackbarSupplier,
    setSupplierDataForUpdate,
    setIsOpenDialogAddOrEditSupplier,
    setPageNoSupplier,
    setPageSizeSupplier,
} = supplierSlice.actions;

export default supplierSlice.reducer;
