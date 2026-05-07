import {createSlice} from "@reduxjs/toolkit";

const purchaseOrderSlice = createSlice({
    name: "purchaseOrder",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditPurchaseOrder: false,
        purchaseOrderDataForUpdate: null,
        isOpenSnackbarPurchaseOrder: false,
        isOpenDeletePurchaseOrderDialog: false,
        alertPurchaseOrder: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            status: "",
            buyerId: "",
            styleId: ""
        }
    },
    reducers: {
        setFilterPurchaseOrder: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeletePurchaseOrderDialog: (state, action) => {
            state.isOpenDeletePurchaseOrderDialog = action.payload;
        },
        setAlertPurchaseOrder: (state, action) => {
            state.alertPurchaseOrder = action.payload;
        },
        setIsOpenSnackbarPurchaseOrder: (state, action) => {
            state.isOpenSnackbarPurchaseOrder = action.payload;
        },
        setPurchaseOrderDataForUpdate: (state, action) => {
            state.purchaseOrderDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditPurchaseOrder: (state, action) => {
            state.isOpenDialogAddOrEditPurchaseOrder = action.payload;
        },
        setPageNoPurchaseOrder: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizePurchaseOrder: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterPurchaseOrder,
    setIsOpenDeletePurchaseOrderDialog,
    setAlertPurchaseOrder,
    setIsOpenSnackbarPurchaseOrder,
    setPurchaseOrderDataForUpdate,
    setIsOpenDialogAddOrEditPurchaseOrder,
    setPageNoPurchaseOrder,
    setPageSizePurchaseOrder,
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
