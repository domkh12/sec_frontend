import {createSlice} from "@reduxjs/toolkit";

const buyerSlice = createSlice({
    name: "buyer",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditBuyer: false,
        buyerDataForUpdate: null,
        isOpenSnackbarBuyer: false,
        isOpenDeleteBuyerDialog: false,
        alertBuyer: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterBuyer: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteBuyerDialog: (state, action) => {
            state.isOpenDeleteBuyerDialog = action.payload;
        },
        setAlertBuyer: (state, action) => {
            state.alertBuyer = action.payload;
        },
        setIsOpenSnackbarBuyer: (state, action) => {
            state.isOpenSnackbarBuyer = action.payload;
        },
        setBuyerDataForUpdate: (state, action) => {
            state.buyerDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditBuyer: (state, action) => {
            state.isOpenDialogAddOrEditBuyer = action.payload;
        },
        setPageNoBuyer: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeBuyer: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterBuyer,
    setIsOpenDeleteBuyerDialog,
    setAlertBuyer,
    setIsOpenSnackbarBuyer,
    setBuyerDataForUpdate,
    setIsOpenDialogAddOrEditBuyer,
    setPageNoBuyer,
    setPageSizeBuyer,
} = buyerSlice.actions;

export default buyerSlice.reducer;
