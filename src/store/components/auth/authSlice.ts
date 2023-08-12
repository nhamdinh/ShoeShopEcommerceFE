import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfAuth {
  dataAuth: any;
}

const initialState: IfAuth = {
  dataAuth: [],
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setStoAuth: (state: IfAuth, action: PayloadAction<IfAuth>) => {
      state.dataAuth = action.payload.dataAuth;
    },
  },
});

const { reducer, actions } = authSlice;
export const { setStoAuth } = actions;
export default reducer;
