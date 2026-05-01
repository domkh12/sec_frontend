import {createSlice} from "@reduxjs/toolkit";
const calculateOutputQty = (state) => {
    let total = 0;
    console.log(state)

    state.currentOutput.forEach(item => {
        total += Number(item.qty) || 0;
    });

    state.totalOutput = total;
};
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
        selectedLine: {}
    },
    reducers: {
        setSelectedLine: (state, action) => {
            state.selectedLine = action.payload;
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
        },
        setClearCurrentOutput: (state) => {
          state.currentOutput = [];
          state.totalOutput = 0;
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
