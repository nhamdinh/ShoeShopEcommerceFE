import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfAuth {
  userInfo: any;
  accessToken: any;
}

const initialState: IfAuth = {
  userInfo: {},
  accessToken: "",
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLogout: (state: IfAuth, action: PayloadAction) => {
      state.accessToken = "";
      state.userInfo = {};
      localStorage.clear();
      // if (typeof window !== "undefined") {
      //   window.location.href = "/";
      // }
    },
    setUserInfo: (state: IfAuth, action: PayloadAction) => {
      state.userInfo = action.payload;
    },
  },
});

const { reducer, actions } = authSlice;
export const { userLogout, setUserInfo } = actions;
export default reducer;
