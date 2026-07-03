import {createSlice} from "@reduxjs/toolkit";
import dayjs from "dayjs";
const calculateOutputQty = (state) => {
    let totalOutput = 0;
    let currentDefect = 0;

    state.currentOutput.forEach(item => {
        if (item.entryType === "defect") {
            currentDefect += Number(item.qty) || 0;
        } else {
            totalOutput += Number(item.qty) || 0;
        }
    });

    state.totalOutput = totalOutput;
    state.currentDefect = currentDefect;
    state.totalDefect = currentDefect + (Number(state.defectTypeTotal) || 0);
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

const getEntryKey = (item) => {
    const type = item.entryType || "output";
    const sizeKey = type === "defect" ? item.defectType?.id ?? item.defectType?.name ?? "no-defect-type" : item.size?.id ?? item.size?.size ?? "no-size";

    return `${item.mo}-${type}-${sizeKey}`;
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
        currentDefect: 0,
        defectTypeTotal: 0,
        ratingDefect: 0.0,
        selectedLine: {},
        selectedTime: {},
        selectedToLine: {},
        selectedDefect: [],
        outputDate: dayjs(new Date()),
    },
    reducers: {
        setOutputDate: (state, action) => {
            state.outputDate = action.payload;
        },
        setSelectedDefect: (state, action) => {
            state.selectedDefect = action.payload;
        },
        setSelectedToLine: (state, action) => {
            state.selectedToLine = action.payload;
        },
        setTotalDefect: (state, action) => {
            state.defectTypeTotal = Number(action.payload) || 0;
            state.totalDefect = (Number(state.currentDefect) || 0) + state.defectTypeTotal;
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
              item => getEntryKey(item) === getEntryKey(incoming.item)
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
          state.currentDefect = 0;
          state.defectTypeTotal = 0;
          state.selectedToLine = {};
          state.selectedTime = {};
          state.selectedDefect = []
          state.ratingDefect = 0.0;
          state.outputDate = dayjs(new Date());
        },
        setDecreaseQty:(state, action) => {
            const incoming = action.payload;

            const index = state.currentOutput.findIndex(
                item => getEntryKey(item) === getEntryKey(incoming)
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
                item => getEntryKey(item) === getEntryKey(incoming)
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
              item => getEntryKey(item) === getEntryKey(incoming)
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
    setOutputDate,
    setSelectedDefect,
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
