import {createSlice} from "@reduxjs/toolkit";

const tvSlice = createSlice({
    name: "tv",
    initialState: {
        pageNo: 1,
        pageSize: 25,
        isOpenCreateTVDialog: false
    },
    reducers: {
        setPageNoTv: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSizeTv: (state, action) => {
            state.pageSize = action.payload;
        },
        setIsOpenCreateTVDialog: (state, action) => {
            state.isOpenCreateTVDialog = action.payload;
        }
    },
});

export const {
    setIsOpenCreateTVDialog
} = tvSlice.actions;

export default tvSlice.reducer;
