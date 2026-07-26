import {createSlice} from "@reduxjs/toolkit";

const analysisSlice = createSlice({
    name: "analysis",
    initialState: {
        dateFrom: "",
        dateTo: "",
        dataKey: "output",
        fetchedAtOutputToday: ""
    },
    reducers: {
        setFetchedAtOutputToday: (state, action) => {state.fetchedAtOutputToday = action.payload;},
        setDataKey: (state, action) => {state.dataKey = action.payload;},
        setDateFrom: (state, action) => {state.dateFrom = action.payload;},
        setDateTo: (state, action) => {state.dateTo = action.payload;},

    },
});

export const {
    setFetchedAtOutputToday,
    setDataKey,
    setDateFrom,
    setDateTo
} = analysisSlice.actions;

export default analysisSlice.reducer;
