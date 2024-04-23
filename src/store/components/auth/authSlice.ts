import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ACCESSTOKEN_STORAGE, NAME_STORAGE, REFRESHTOKEN_STORAGE } from "../../../utils/constants";

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
      localStorage.removeItem(NAME_STORAGE);
      localStorage.removeItem(ACCESSTOKEN_STORAGE);
      localStorage.removeItem(REFRESHTOKEN_STORAGE);
      // localStorage.clear();
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
