import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfOrders {
  dataOrders: any;
  checkedCarts: any;
  checkoutCartsParam: any;
}

const initialState: IfOrders = {
  dataOrders: [],
  checkedCarts: [],
  checkoutCartsParam: [],
};

const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    setStoOrders: (state: IfOrders, action: PayloadAction<IfOrders>) => {
      state.dataOrders = action.payload.dataOrders ?? [];
    },
    setStcheckedCarts: (state: IfOrders, action: PayloadAction<IfOrders>) => {
      state.checkedCarts = action.payload ?? [];
    },
    setStcheckoutCartsParam: (
      state: IfOrders,
      action: PayloadAction<IfOrders>
    ) => {
      state.checkoutCartsParam = action.payload ?? [];
    },
  },
});

const { reducer, actions } = ordersSlice;
export const { setStoOrders, setStcheckedCarts, setStcheckoutCartsParam } =
  actions;
export default reducer;
