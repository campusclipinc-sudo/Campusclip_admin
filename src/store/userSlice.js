import { createSlice } from "@reduxjs/toolkit";
import { setAuthToken } from "../libs/HttpClients";

const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: null,
    isLogin: false,
  },
  reducers: {
    loginSuccess: (state, { payload }) => {
      state.payload = payload;
      state.user = payload.userData;
      state.isLogin = payload.isLogin;
      state.accessToken = payload.accessToken;
      setAuthToken(payload.accessToken);
      return state;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isLogin = false;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export const isUserLoggedIn = (state) => state.user.isLogin;
export default userSlice.reducer;
