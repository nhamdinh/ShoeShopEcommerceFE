import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfOrders {
  checkedCarts: any;
  checkoutCartsParam: any;
}

const initialState: IfOrders = {
  checkedCarts: [],
  checkoutCartsParam: [],
};

const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    stSetCheckoutCartsParams: (
      state: IfOrders,
      action: PayloadAction<any>
    ) => {
      state.checkoutCartsParam = action.payload ?? [];
    },
  },
});

const { reducer, actions } = ordersSlice;
export const { stSetCheckoutCartsParams } = actions;
export default reducer;
