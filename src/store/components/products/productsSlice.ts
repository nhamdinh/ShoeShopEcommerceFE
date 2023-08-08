import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IfProducts {
  dataProducts: any;
}

const initialState: IfProducts = {
  dataProducts: [],
};

const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setStoProducts: (state: IfProducts, action: PayloadAction<IfProducts>) => {
      state.dataProducts = action.payload.dataProducts;
    },
  },
});

const { reducer, actions } = productsSlice;
export const { setStoProducts } = actions;
export default reducer;
