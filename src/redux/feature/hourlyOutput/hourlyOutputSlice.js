import {createSlice} from "@reduxjs/toolkit";

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
        currentOutput: []
    },
    reducers: {
        setDecreaseQty:(state, action) => {
            const incoming = action.payload;

            const index = state.currentOutput.findIndex(
                item => item.mo === incoming.mo && item.size.size === incoming.size.size
            );
            console.log(index)
            if (index !== -1) {
                const existing = state.currentOutput[index];
                if (existing.qty > 1) {
                    existing.qty -= 1;
                } else {
                    state.currentOutput.splice(index, 1);
                }

            }
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
          // state.currentOutput = [...state.currentOutput, action.payload];
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
