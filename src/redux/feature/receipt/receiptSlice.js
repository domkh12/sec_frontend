import {createSlice} from "@reduxjs/toolkit";

const receiptSlice = createSlice({
    name: "receipt",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditReceipt: false,
        receiptDataForUpdate: null,
        isOpenSnackbarReceipt: false,
        isOpenDeleteReceiptDialog: false,
        alertReceipt: {type: "success", message: ""},
        filter:{
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterReceipt: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteReceiptDialog: (state, action) => {
            state.isOpenDeleteReceiptDialog = action.payload;
        },
        setAlertReceipt: (state, action) => {
            state.alertReceipt = action.payload;
        },
        setIsOpenSnackbarReceipt: (state, action) => {
            state.isOpenSnackbarReceipt = action.payload;
        },
        setReceiptDataForUpdate: (state, action) => {
            state.receiptDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditReceipt: (state, action) => {
            state.isOpenDialogAddOrEditReceipt = action.payload;
        },
        setPageNoReceipt: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeReceipt: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterReceipt,
    setIsOpenDeleteReceiptDialog,
    setAlertReceipt,
    setIsOpenSnackbarReceipt,
    setReceiptDataForUpdate,
    setIsOpenDialogAddOrEditReceipt,
    setPageNoReceipt,
    setPageSizeReceipt,
} = receiptSlice.actions;

export default receiptSlice.reducer;
