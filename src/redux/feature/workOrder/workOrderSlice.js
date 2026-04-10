import {createSlice} from "@reduxjs/toolkit";

const workOrderSlice = createSlice({
    name: "workOrder",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditWorkOrder: false,
        workOrderDataForUpdate: null,
        isOpenSnackbarWorkOrder: false,
        isOpenDeleteWorkOrderDialog: false,
        alertWorkOrder: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterWorkOrder: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteWorkOrderDialog: (state, action) => {
            state.isOpenDeleteWorkOrderDialog = action.payload;
        },
        setAlertWorkOrder: (state, action) => {
            state.alertWorkOrder = action.payload;
        },
        setIsOpenSnackbarWorkOrder: (state, action) => {
            state.isOpenSnackbarWorkOrder = action.payload;
        },
        setWorkOrderDataForUpdate: (state, action) => {
            state.workOrderDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditWorkOrder: (state, action) => {
            state.isOpenDialogAddOrEditWorkOrder = action.payload;
        },
        setPageNoWorkOrder: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeWorkOrder: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterWorkOrder,
    setIsOpenDeleteWorkOrderDialog,
    setAlertWorkOrder,
    setIsOpenSnackbarWorkOrder,
    setWorkOrderDataForUpdate,
    setIsOpenDialogAddOrEditWorkOrder,
    setPageNoWorkOrder,
    setPageSizeWorkOrder,
} = workOrderSlice.actions;

export default workOrderSlice.reducer;
