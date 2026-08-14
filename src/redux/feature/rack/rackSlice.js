import {createSlice} from "@reduxjs/toolkit";

const rackSlice = createSlice({
    name: "rack",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditRack: false,
        rackDataForUpdate: null,
        isOpenSnackbarRack: false,
        isOpenDeleteRackDialog: false,
        alertRack: {type: "success", message: ""},
        filter:{
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterRack: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteRackDialog: (state, action) => {
            state.isOpenDeleteRackDialog = action.payload;
        },
        setAlertRack: (state, action) => {
            state.alertRack = action.payload;
        },
        setIsOpenSnackbarRack: (state, action) => {
            state.isOpenSnackbarRack = action.payload;
        },
        setRackDataForUpdate: (state, action) => {
            state.rackDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditRack: (state, action) => {
            state.isOpenDialogAddOrEditRack = action.payload;
        },
        setPageNoRack: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeRack: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterRack,
    setIsOpenDeleteRackDialog,
    setAlertRack,
    setIsOpenSnackbarRack,
    setRackDataForUpdate,
    setIsOpenDialogAddOrEditRack,
    setPageNoRack,
    setPageSizeRack,
} = rackSlice.actions;

export default rackSlice.reducer;
