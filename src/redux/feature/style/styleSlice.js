import {createSlice} from "@reduxjs/toolkit";

const styleSlice = createSlice({
    name: "style",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditStyle: false,
        styleDataForUpdate: null,
        isOpenSnackbarStyle: false,
        isOpenDeleteStyleDialog: false,
        alertStyle: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
            status: "",
            subCategory: "",
            color: "",
            size: "",
        }
    },
    reducers: {
        setFilterStyle: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteStyleDialog: (state, action) => {
            state.isOpenDeleteStyleDialog = action.payload;
        },
        setAlertStyle: (state, action) => {
            state.alertStyle = action.payload;
        },
        setIsOpenSnackbarStyle: (state, action) => {
            state.isOpenSnackbarStyle = action.payload;
        },
        setStyleDataForUpdate: (state, action) => {
            state.styleDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditStyle: (state, action) => {
            state.isOpenDialogAddOrEditStyle = action.payload;
        },
        setPageNoStyle: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeStyle: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterStyle,
    setIsOpenDeleteStyleDialog,
    setAlertStyle,
    setIsOpenSnackbarStyle,
    setStyleDataForUpdate,
    setIsOpenDialogAddOrEditStyle,
    setPageNoStyle,
    setPageSizeStyle,
} = styleSlice.actions;

export default styleSlice.reducer;
