import {createSlice} from "@reduxjs/toolkit";

const outputDetailSlice = createSlice({
    name: "outputDetail",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditOutputDetail: false,
        outputDetailDataForUpdate: null,
        isOpenSnackbarOutputDetail: false,
        isOpenDeleteOutputDetailDialog: false,
        alertOutputDetail: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            lineId: "",
            styleId: "",
            buyerId: "",
            reportDate: "",
        }
    },
    reducers: {
        setFilterOutputDetail: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteOutputDetailDialog: (state, action) => {
            state.isOpenDeleteOutputDetailDialog = action.payload;
        },
        setAlertOutputDetail: (state, action) => {
            state.alertOutputDetail = action.payload;
        },
        setIsOpenSnackbarOutputDetail: (state, action) => {
            state.isOpenSnackbarOutputDetail = action.payload;
        },
        setOutputDetailDataForUpdate: (state, action) => {
            state.outputDetailDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditOutputDetail: (state, action) => {
            state.isOpenDialogAddOrEditOutputDetail = action.payload;
        },
        setPageNoOutputDetail: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeOutputDetail: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterOutputDetail,
    setIsOpenDeleteOutputDetailDialog,
    setAlertOutputDetail,
    setIsOpenSnackbarOutputDetail,
    setOutputDetailDataForUpdate,
    setIsOpenDialogAddOrEditOutputDetail,
    setPageNoOutputDetail,
    setPageSizeOutputDetail,
} = outputDetailSlice.actions;

export default outputDetailSlice.reducer;
