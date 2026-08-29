import {createSlice} from "@reduxjs/toolkit";

const materialMaterialColorSlice = createSlice({
    name: "materialColor",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditMaterialColor: false,
        materialColorDataForUpdate: null,
        isOpenSnackbarMaterialColor: false,
        isOpenDeleteMaterialColorDialog: false,
        alertMaterialColor: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterMaterialColor: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteMaterialColorDialog: (state, action) => {
            state.isOpenDeleteMaterialColorDialog = action.payload;
        },
        setAlertMaterialColor: (state, action) => {
            state.alertMaterialColor = action.payload;
        },
        setIsOpenSnackbarMaterialColor: (state, action) => {
            state.isOpenSnackbarMaterialColor = action.payload;
        },
        setMaterialColorDataForUpdate: (state, action) => {
            state.materialColorDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditMaterialColor: (state, action) => {
            state.isOpenDialogAddOrEditMaterialColor = action.payload;
        },
        setPageNoMaterialColor: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeMaterialColor: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setFilterMaterialColor,
    setIsOpenDeleteMaterialColorDialog,
    setAlertMaterialColor,
    setIsOpenSnackbarMaterialColor,
    setMaterialColorDataForUpdate,
    setIsOpenDialogAddOrEditMaterialColor,
    setPageNoMaterialColor,
    setPageSizeMaterialColor,
} = materialMaterialColorSlice.actions;

export default materialMaterialColorSlice.reducer;
