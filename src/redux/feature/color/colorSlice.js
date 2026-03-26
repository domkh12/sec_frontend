import {createSlice} from "@reduxjs/toolkit";

const colorSlice = createSlice({
    name: "color",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditColor: false,
        colorDataForUpdate: null,
        isOpenSnackbarColor: false,
        isOpenDeleteColorDialog: false,
        alertColor: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterColor: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteColorDialog: (state, action) => {
            state.isOpenDeleteColorDialog = action.payload;
        },
        setAlertColor: (state, action) => {
            state.alertColor = action.payload;
        },
        setIsOpenSnackbarColor: (state, action) => {
            state.isOpenSnackbarColor = action.payload;
        },
        setColorDataForUpdate: (state, action) => {
            state.colorDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditColor: (state, action) => {
            state.isOpenDialogAddOrEditColor = action.payload;
        },
        setPageNoColor: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeColor: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterColor,
    setIsOpenDeleteColorDialog,
    setAlertColor,
    setIsOpenSnackbarColor,
    setColorDataForUpdate,
    setIsOpenDialogAddOrEditColor,
    setPageNoColor,
    setPageSizeColor,
} = colorSlice.actions;

export default colorSlice.reducer;
