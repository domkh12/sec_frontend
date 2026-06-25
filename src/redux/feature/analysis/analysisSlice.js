import {createSlice} from "@reduxjs/toolkit";

const analysisSlice = createSlice({
    name: "analysis",
    initialState: {
        dateFrom: "",
        dateTo: "",
    },
    reducers: {
        setDateFrom: (state, action) => {state.dateFrom = action.payload;},
        setDateTo: (state, action) => {state.dateTo = action.payload;},

    },
});

export const {
    setDateFrom,
    setDateTo
} = analysisSlice.actions;

export default analysisSlice.reducer;
