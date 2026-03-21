import {createSlice} from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        pageNo: 1,
        pageSize: 20,
        isOpenDialogAddOrEditCategory: false,
        isOpenDialogAddOrEditSubCategory: false,
        categoryDataForUpdate: null,
        isOpenSnackbarCategory: false,
        isOpenDeleteCategoryDialog: false,
        alertCategory: {type: "success", message: ""},
        isOpenCollapseCategory: false,
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        },
        deleteCategoryData: null,
    },
    reducers: {
        setDeleteCategory: (state, action) => {
            state.deleteCategoryData = action.payload;
        },
        setFilterCategory: (state, action) => {
            state.filter = action.payload;
        },
        setCloseDialogAddOrEditCateAndSubCate: (state) => {
            state.isOpenDialogAddOrEditCategory = false;
            state.isOpenDialogAddOrEditSubCategory = false;
        },
        setIsOpenDialogAddOrEditSubCategory: (state, action) => {
            state.isOpenDialogAddOrEditSubCategory = action.payload;
        },
        setIsOpenCollapseCategory: (state, action) => {
            state.isOpenCollapseCategory = action.payload;
        },
        setIsOpenDeleteCategoryDialog: (state, action) => {
            state.isOpenDeleteCategoryDialog = action.payload;
        },
        setAlertCategory: (state, action) => {
            state.alertCategory = action.payload;
        },
        setIsOpenSnackbarCategory: (state, action) => {
            state.isOpenSnackbarCategory = action.payload;
        },
        setCategoryDataForUpdate: (state, action) => {
            state.categoryDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditCategory: (state, action) => {
            state.isOpenDialogAddOrEditCategory = action.payload;
        },
        setPageNoCategory: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeCategory: (state, action) => {
            state.pageSize = action.payload;
        }
    },
});

export const {
    setDeleteCategory,
    setFilterCategory,
    setCloseDialogAddOrEdit,
    setIsOpenDialogAddOrEditSubCategory,
    setCloseDialogAddOrEditCateAndSubCate,
    setIsOpenCollapseCategory,
    setIsOpenDeleteCategoryDialog,
    setAlertCategory,
    setIsOpenSnackbarCategory,
    setCategoryDataForUpdate,
    setIsOpenDialogAddOrEditCategory,
    setPageNoCategory,
    setPageSizeCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
