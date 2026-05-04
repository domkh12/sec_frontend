import {createSlice} from "@reduxjs/toolkit";
const calculateOutputQty = (state) => {
    let total = 0;

    state.currentOutput.forEach(item => {
        total += Number(item.qty) || 0;
    });

    state.totalOutput = total;
};

const calculateDefectRate = (state) => {
    const totalOutput = Number(state.totalOutput) || 0;
    const totalDefect = Number(state.totalDefect) || 0;

    if (totalOutput === 0){
        state.ratingDefect = 0;
    }else {
        state.ratingDefect = ((totalDefect / totalOutput) * 100).toFixed(2);
    }
}
const hourlyOutputSlice = createSlice({
    name: "hourlyOutput",
    initialState: {
        isOpenDialogAddOrEditHourlyOutput: false,
        hourlyOutputDataForUpdate: null,
        isOpenSnackbarHourlyOutput: false,
        isOpenDeleteHourlyOutputDialog: false,
        alertHourlyOutput: {type: "success", message: ""},
        filter: {
            pageNo: 1,
            pageSize: 20,
            search: "",
        },
        currentOutput: [],
        totalOutput: 0,
        totalDefect: 0,
        ratingDefect: 0.0,
        selectedLine: {},
        selectedTime: {},
        selectedToLine: {}
    },
    reducers: {
        setSelectedToLine: (state, action) => {
            state.selectedToLine = action.payload;
        },
        setTotalDefect: (state, action) => {
            state.totalDefect = action.payload;
            calculateDefectRate(state);
        },
        setSelectedTime: (state, action) => {
            state.selectedTime = action.payload;
        },
        setSelectedLine: (state, action) => {
            state.selectedLine = action.payload;
            state.currentOutput = [];
        },
        setQtyCurrentOutputChange: (state, action) => {
            const incoming = action.payload;
            const existing = state.currentOutput.find(
              item => item.mo === incoming.item.mo && item.size.size === incoming.item.size.size
            );

            if (existing){
                existing.qty = incoming.qty;
            }

            calculateOutputQty(state);
            calculateDefectRate(state);
        },
        setClearCurrentOutput: (state) => {
          state.currentOutput = [];
          state.totalOutput = 0;
          state.totalDefect = 0;
          state.selectedToLine = {};
          state.selectedTime = {};
          state.ratingDefect = 0.0;
        },
        setDecreaseQty:(state, action) => {
            const incoming = action.payload;

            const index = state.currentOutput.findIndex(
                item => item.mo === incoming.mo && item.size.size === incoming.size.size
            );

            if (index !== -1) {
                const existing = state.currentOutput[index];
                if (existing.qty > 1) {
                    existing.qty -= 1;
                } else {
                    state.currentOutput.splice(index, 1);
                }
            }

            calculateOutputQty(state);
            calculateDefectRate(state);
        },
        setIncreaseQty:(state, action) => {
            const incoming = action.payload;

            const existing = state.currentOutput.find(
                item => item.mo === incoming.mo && item.size.size === incoming.size.size
            );

            if (existing) {
                existing.qty += 1
            }else {
                state.currentOutput.push(incoming);
            }
            calculateOutputQty(state);
            calculateDefectRate(state);
        },
        setCurrentOutput: (state, action) => {
          const incoming = action.payload;

          const existing = state.currentOutput.find(
              item => item.mo === incoming.mo && item.size.size === incoming.size.size
          );

          if (existing) {
              existing.qty += incoming.qty
          }else {
              state.currentOutput.push(incoming);
          }

          calculateOutputQty(state);
          calculateDefectRate(state);
        },
        setFilterHourlyOutput: (state, action) => {
            state.filter = action.payload;
        },
        setIsOpenDeleteHourlyOutputDialog: (state, action) => {
            state.isOpenDeleteHourlyOutputDialog = action.payload;
        },
        setAlertHourlyOutput: (state, action) => {
            state.alertHourlyOutput = action.payload;
        },
        setIsOpenSnackbarHourlyOutput: (state, action) => {
            state.isOpenSnackbarHourlyOutput = action.payload;
        },
        setHourlyOutputDataForUpdate: (state, action) => {
            state.hourlyOutputDataForUpdate = action.payload;
        },
        setIsOpenDialogAddOrEditHourlyOutput: (state, action) => {
            state.isOpenDialogAddOrEditHourlyOutput = action.payload;
        }
    },
});

export const {
    setSelectedToLine,
    setTotalDefect,
    setSelectedTime,
    setSelectedLine,
    setQtyCurrentOutputChange,
    setClearCurrentOutput,
    setIncreaseQty,
    setDecreaseQty,
    setCurrentOutput,
    setFilterHourlyOutput,
    setIsOpenDeleteHourlyOutputDialog,
    setAlertHourlyOutput,
    setIsOpenSnackbarHourlyOutput,
    setHourlyOutputDataForUpdate,
    setIsOpenDialogAddOrEditHourlyOutput,
} = hourlyOutputSlice.actions;

export default hourlyOutputSlice.reducer;
