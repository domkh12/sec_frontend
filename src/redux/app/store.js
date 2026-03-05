import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice.js";
import { apiSlice } from "./api/apiSlice.js";
import { setupListeners } from "@reduxjs/toolkit/query";
import utilReducer from "../feature/util/utilSlice.js"
import tvReducer from "../feature/tv/tvSlice.js"
import departmentReducer from "../feature/department/departmentSlice.js"

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    util: utilReducer,
    tv: tvReducer,
    department: departmentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: false,
});

setupListeners(store.dispatch);
export default store;
