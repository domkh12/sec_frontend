import {createSlice} from "@reduxjs/toolkit";

const unitSlice = createSlice({
    name: "unit",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditUnit: false,
        unitDataForUpdate: null,
        isOpenSnackbarUnit: false,
        isOpenDeleteUnitDialog: false,
        alertUnit: {type: "success", message: ""},
        filter:{
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterUnit: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteUnitDialog: (state, action) => {
            state.isOpenDeleteUnitDialog = action.payload;
        },
        setAlertUnit: (state, action) => {
            state.alertUnit = action.payload;
        },
        setIsOpenSnackbarUnit: (state, action) => {
            state.isOpenSnackbarUnit = action.payload;
        },
        setUnitDataForUpdate: (state, action) => {
            state.unitDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditUnit: (state, action) => {
            state.isOpenDialogAddOrEditUnit = action.payload;
        },
        setPageNoUnit: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeUnit: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterUnit,
    setIsOpenDeleteUnitDialog,
    setAlertUnit,
    setIsOpenSnackbarUnit,
    setUnitDataForUpdate,
    setIsOpenDialogAddOrEditUnit,
    setPageNoUnit,
    setPageSizeUnit,
} = unitSlice.actions;

export default unitSlice.reducer;
