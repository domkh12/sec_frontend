import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditProduct: false,
        productDataForUpdate: null,
        isOpenSnackbarProduct: false,
        isOpenDeleteProductDialog: false,
        alertProduct: {type: "success", message: ""}

    },
    reducers: {
        setIsOpenDeleteProductDialog: (state, action) => {
            state.isOpenDeleteProductDialog = action.payload;
        },
        setAlertProduct: (state, action) => {
            state.alertProduct = action.payload;
        },
        setIsOpenSnackbarProduct: (state, action) => {
            state.isOpenSnackbarProduct = action.payload;
        },
        setProductDataForUpdate: (state, action) => {
            state.productDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditProduct: (state, action) => {
            state.isOpenDialogAddOrEditProduct = action.payload;
        },
        setPageNoProduct: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeProduct: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setIsOpenDeleteProductDialog,
    setAlertProduct,
    setIsOpenSnackbarProduct,
    setProductDataForUpdate,
    setIsOpenDialogAddOrEditProduct,
    setPageNoProduct,
    setPageSizeProduct,
} = productSlice.actions;

export default productSlice.reducer;
