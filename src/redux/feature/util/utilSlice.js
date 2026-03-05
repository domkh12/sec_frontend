import { createSlice } from "@reduxjs/toolkit";

const utilSlice = createSlice({
    name: "util",

    initialState: {
        currentDateTime: "00/00/00",
        currentDate: "00/00/00",
        currentTime: "00:00:00",
        rowTv: ["l"]
    },

    reducers: {
        setCurrentDateTime:(state, action) => {
           state.currentDateTime = action.payload;
        },
        setCurrentDate:(state, action) => {
            state.currentDate = action.payload;
        },
        setCurrentTime:(state, action) => {
            state.currentTime = action.payload;
        },
        setRowTv:(state, action) => {
            state.rowTv = action.payload;
        }
    },
});

export const {
    setRowTv,
    setCurrentDateTime,
    setCurrentDate,
    setCurrentTime
} = utilSlice.actions;

let timerId = null;

export const startClock = () => (dispatch) => {
    // Clear any existing timer to prevent multiple clocks running at once
    if (timerId) clearInterval(timerId);

    timerId = setInterval(() => {
        const now = new Date();

        // 1. Full String (e.g., "2/17/2026, 1:30:00 PM")
        dispatch(setCurrentDateTime(now.toLocaleString()));

        // 2. Date Only (e.g., "2/17/2026")
        dispatch(setCurrentDate(now.toLocaleDateString()));

        // 3. Time Only (e.g., "1:30:00 PM")
        dispatch(setCurrentTime(now.toLocaleTimeString()));
    }, 1000);
};

export const stopClock = () => () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
};

export default utilSlice.reducer;
