import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfOrders {
  dataOrders: any;
}

const initialState: IfOrders = {
  dataOrders: [],
};

const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    setStoOrders: (state: IfOrders, action: PayloadAction<IfOrders>) => {
      state.dataOrders = action.payload.dataOrders;
    },
  },
});

const { reducer, actions } = ordersSlice;
export const { setStoOrders } = actions;
export default reducer;
