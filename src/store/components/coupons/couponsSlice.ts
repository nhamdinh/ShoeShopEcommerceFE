import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfCoupons {}

const initialState: IfCoupons = {};

const couponsSlice = createSlice({
  name: "couponsSlice",
  initialState,
  reducers: {},
});

const { reducer, actions } = couponsSlice;
export const {} = actions;
export default reducer;
