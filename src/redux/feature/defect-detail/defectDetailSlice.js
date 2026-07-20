import {createSlice} from "@reduxjs/toolkit";

const defectDetailSlice = createSlice({
    name: "defectDetail",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditDefectDetail: false,
        defectDetailDataForUpdate: null,
        isOpenSnackbarDefectDetail: false,
        isOpenDeleteDefectDetailDialog: false,
        alertDefectDetail: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            lineId: "",
            buyerId: "",
            reportDate: "",
        }
    },
    reducers: {
        setFilterDefectDetail: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteDefectDetailDialog: (state, action) => {
            state.isOpenDeleteDefectDetailDialog = action.payload;
        },
        setAlertDefectDetail: (state, action) => {
            state.alertDefectDetail = action.payload;
        },
        setIsOpenSnackbarDefectDetail: (state, action) => {
            state.isOpenSnackbarDefectDetail = action.payload;
        },
        setDefectDetailDataForUpdate: (state, action) => {
            state.defectDetailDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditDefectDetail: (state, action) => {
            state.isOpenDialogAddOrEditDefectDetail = action.payload;
        },
        setPageNoDefectDetail: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeDefectDetail: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterDefectDetail,
    setIsOpenDeleteDefectDetailDialog,
    setAlertDefectDetail,
    setIsOpenSnackbarDefectDetail,
    setDefectDetailDataForUpdate,
    setIsOpenDialogAddOrEditDefectDetail,
    setPageNoDefectDetail,
    setPageSizeDefectDetail,
} = defectDetailSlice.actions;

export default defectDetailSlice.reducer;
