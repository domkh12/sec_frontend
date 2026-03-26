import {createSlice} from "@reduxjs/toolkit";

const sizeSlice = createSlice({
    name: "size",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditSize: false,
        sizeDataForUpdate: null,
        isOpenSnackbarSize: false,
        isOpenDeleteSizeDialog: false,
        alertSize: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterSize: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteSizeDialog: (state, action) => {
            state.isOpenDeleteSizeDialog = action.payload;
        },
        setAlertSize: (state, action) => {
            state.alertSize = action.payload;
        },
        setIsOpenSnackbarSize: (state, action) => {
            state.isOpenSnackbarSize = action.payload;
        },
        setSizeDataForUpdate: (state, action) => {
            state.sizeDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditSize: (state, action) => {
            state.isOpenDialogAddOrEditSize = action.payload;
        },
        setPageNoSize: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeSize: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterSize,
    setIsOpenDeleteSizeDialog,
    setAlertSize,
    setIsOpenSnackbarSize,
    setSizeDataForUpdate,
    setIsOpenDialogAddOrEditSize,
    setPageNoSize,
    setPageSizeSize,
} = sizeSlice.actions;

export default sizeSlice.reducer;
