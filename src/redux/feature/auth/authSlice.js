import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  // initial data
  initialState: {
    token: null,
    profile: {}
  },

  // function
  reducers: {
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
  setProfile,
  setCredentials,
  logOut,
  setQrCodeUrl,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
