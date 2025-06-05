/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice } from "@reduxjs/toolkit";

type TUser = {
  email: string;
};

type InitAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: InitAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      (state.user = user), (state.token = token);
    },
    logOut: state => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
