import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice.js";
import { apiSlice } from "./api/apiSlice.js";
import { setupListeners } from "@reduxjs/toolkit/query";
import utilReducer from "../feature/util/utilSlice.js"
import tvReducer from "../feature/tv/tvSlice.js"
import departmentReducer from "../feature/department/departmentSlice.js"
import productionReducer from "../feature/productionLine/productionLineSlice.js"
import productReducer from "../feature/product/productSlice.js"
import userReducer from "../feature/user/userSlice.js"
import roleReducer from "../feature/role/roleSlice.js"
import categoryReducer from "../feature/category/categorySlice.js"
import buyerReducer from "../feature/buyer/buyerSlice.js"
import sizeReducer from "../feature/size/sizeSlice.js"
import colorReducer from "../feature/color/colorSlice.js"
import materialReducer from "../feature/material/materialSlice.js"
import workOrderReducer from "../feature/workOrder/workOrderSlice.js"

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    util: utilReducer,
    tv: tvReducer,
    department: departmentReducer,
    productionLine: productionReducer,
    product: productReducer,
    user: userReducer,
    role: roleReducer,
    category: categoryReducer,
    buyer: buyerReducer,
    size: sizeReducer,
    color: colorReducer,
    material: materialReducer,
    workOrder: workOrderReducer
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
