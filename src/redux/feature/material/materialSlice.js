import {createSlice} from "@reduxjs/toolkit";

const materialSlice = createSlice({
    name: "material",
    initialState: {
        isOpenDialogAddOrEditMaterial: false,
        materialDataForUpdate: null,
        isOpenSnackbarMaterial: false,
        isOpenDeleteMaterialDialog: false,
        alertMaterial: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        }
    },
    reducers: {
        setFilterMaterial: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteMaterialDialog: (state, action) => {
            state.isOpenDeleteMaterialDialog = action.payload;
        },
        setAlertMaterial: (state, action) => {
            state.alertMaterial = action.payload;
        },
        setIsOpenSnackbarMaterial: (state, action) => {
            state.isOpenSnackbarMaterial = action.payload;
        },
        setMaterialDataForUpdate: (state, action) => {
            state.materialDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditMaterial: (state, action) => {
            state.isOpenDialogAddOrEditMaterial = action.payload;
        }
    },
});

export const {
    setFilterMaterial,
    setIsOpenDeleteMaterialDialog,
    setAlertMaterial,
    setIsOpenSnackbarMaterial,
    setMaterialDataForUpdate,
    setIsOpenDialogAddOrEditMaterial
} = materialSlice.actions;

export default materialSlice.reducer;
