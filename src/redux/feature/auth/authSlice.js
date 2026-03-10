import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  // initial data
  initialState: {
    token: null,
    profile: {},
    isOpenSnackbarProfile: false,
    alert: { type: "success", message: "" },
  },

  // function
  reducers: {
    setAlertProfile: (state, action) => {
      state.alert = action.payload;
    },
    setIsOpenSnackbarProfile: (state, action) => {
      state.isOpenSnackbarProfile = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

export const {
  setAlertProfile,
  setIsOpenSnackbarProfile,
  setProfile,
  setCredentials,
  logOut,
  setQrCodeUrl,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
