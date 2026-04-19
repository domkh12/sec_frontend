import {createSlice} from "@reduxjs/toolkit";

const operationSlice = createSlice({
    name: "operation",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditOperation: false,
        operationDataForUpdate: null,
        isOpenSnackbarOperation: false,
        isOpenDeleteOperationDialog: false,
        alertOperation: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterOperation: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteOperationDialog: (state, action) => {
            state.isOpenDeleteOperationDialog = action.payload;
        },
        setAlertOperation: (state, action) => {
            state.alertOperation = action.payload;
        },
        setIsOpenSnackbarOperation: (state, action) => {
            state.isOpenSnackbarOperation = action.payload;
        },
        setOperationDataForUpdate: (state, action) => {
            state.operationDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditOperation: (state, action) => {
            state.isOpenDialogAddOrEditOperation = action.payload;
        },
        setPageNoOperation: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeOperation: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterOperation,
    setIsOpenDeleteOperationDialog,
    setAlertOperation,
    setIsOpenSnackbarOperation,
    setOperationDataForUpdate,
    setIsOpenDialogAddOrEditOperation,
    setPageNoOperation,
    setPageSizeOperation,
} = operationSlice.actions;

export default operationSlice.reducer;
