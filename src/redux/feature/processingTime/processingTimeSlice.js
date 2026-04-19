import {createSlice} from "@reduxjs/toolkit";

const processingTimeSlice = createSlice({
    name: "processingTime",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditProcessingTime: false,
        processingTimeDataForUpdate: null,
        isOpenSnackbarProcessingTime: false,
        isOpenDeleteProcessingTimeDialog: false,
        alertProcessingTime: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterProcessingTime: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteProcessingTimeDialog: (state, action) => {
            state.isOpenDeleteProcessingTimeDialog = action.payload;
        },
        setAlertProcessingTime: (state, action) => {
            state.alertProcessingTime = action.payload;
        },
        setIsOpenSnackbarProcessingTime: (state, action) => {
            state.isOpenSnackbarProcessingTime = action.payload;
        },
        setProcessingTimeDataForUpdate: (state, action) => {
            state.processingTimeDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditProcessingTime: (state, action) => {
            state.isOpenDialogAddOrEditProcessingTime = action.payload;
        },
        setPageNoProcessingTime: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeProcessingTime: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterProcessingTime,
    setIsOpenDeleteProcessingTimeDialog,
    setAlertProcessingTime,
    setIsOpenSnackbarProcessingTime,
    setProcessingTimeDataForUpdate,
    setIsOpenDialogAddOrEditProcessingTime,
    setPageNoProcessingTime,
    setPageSizeProcessingTime,
} = processingTimeSlice.actions;

export default processingTimeSlice.reducer;
