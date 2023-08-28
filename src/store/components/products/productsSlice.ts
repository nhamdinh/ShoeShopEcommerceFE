import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfProducts {
  dataProducts: any;
  cart: any;
}

const initialState: IfProducts = {
  dataProducts: [],
  cart: {},
};

const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setStoProducts: (state: IfProducts, action: PayloadAction<IfProducts>) => {
      state.dataProducts = action.payload;
    },
    setStoCart: (state: IfProducts, action: PayloadAction<IfProducts>) => {
      state.cart = action.payload;
    },
  },
});

const { reducer, actions } = productsSlice;
export const { setStoProducts, setStoCart } = actions;
export default reducer;
