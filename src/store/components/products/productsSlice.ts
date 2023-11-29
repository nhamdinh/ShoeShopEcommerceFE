import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfProducts {
  dataProducts: any;
  productsCart: any;
  cart: any;
}

const initialState: IfProducts = {
  dataProducts: [],
  productsCart: [],
  cart: {},
};

const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setStoProducts: (state: IfProducts, action: PayloadAction<IfProducts>) => {
      state.dataProducts = action.payload ?? [];
    },
    setStoCart: (state: IfProducts, action: PayloadAction<IfProducts>) => {
      state.cart = action.payload ?? {};
    },
    setStProductsCart: (
      state: IfProducts,
      action: PayloadAction<IfProducts>
    ) => {
      state.productsCart = action.payload ?? [];
    },
  },
});

const { reducer, actions } = productsSlice;
export const { setStoProducts, setStoCart, setStProductsCart } = actions;
export default reducer;
