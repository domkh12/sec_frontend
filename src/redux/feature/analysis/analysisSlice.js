import {createSlice} from "@reduxjs/toolkit";

const analysisSlice = createSlice({
    name: "analysis",
    initialState: {
        dateFrom: "",
        dateTo: "",
        dataKey: "output"
    },
    reducers: {
        setDataKey: (state, action) => {state.dataKey = action.payload;},
        setDateFrom: (state, action) => {state.dateFrom = action.payload;},
        setDateTo: (state, action) => {state.dateTo = action.payload;},

    },
});

export const {
    setDataKey,
    setDateFrom,
    setDateTo
} = analysisSlice.actions;

export default analysisSlice.reducer;
