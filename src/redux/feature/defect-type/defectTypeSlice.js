import {createSlice} from "@reduxjs/toolkit";

const defectTypeSlice = createSlice({
    name: "defectType",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditDefectType: false,
        defectTypeDataForUpdate: null,
        isOpenSnackbarDefectType: false,
        isOpenDeleteDefectTypeDialog: false,
        alertDefectType: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterDefectType: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteDefectTypeDialog: (state, action) => {
            state.isOpenDeleteDefectTypeDialog = action.payload;
        },
        setAlertDefectType: (state, action) => {
            state.alertDefectType = action.payload;
        },
        setIsOpenSnackbarDefectType: (state, action) => {
            state.isOpenSnackbarDefectType = action.payload;
        },
        setDefectTypeDataForUpdate: (state, action) => {
            state.defectTypeDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditDefectType: (state, action) => {
            state.isOpenDialogAddOrEditDefectType = action.payload;
        },
        setPageNoDefectType: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeDefectType: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterDefectType,
    setIsOpenDeleteDefectTypeDialog,
    setAlertDefectType,
    setIsOpenSnackbarDefectType,
    setDefectTypeDataForUpdate,
    setIsOpenDialogAddOrEditDefectType,
    setPageNoDefectType,
    setPageSizeDefectType,
} = defectTypeSlice.actions;

export default defectTypeSlice.reducer;
