import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface dialogObj {
  isOpen: any;
  content: String;
  step: Number;
}

const initialState: dialogObj = {
  isOpen: "",
  content: "",
  step: 3,
};

const toastDialog = createSlice({
  name: "toastPopup",
  initialState,
  reducers: {
    openToast: (state: dialogObj, action: PayloadAction<any>) => {
      state.isOpen = action.payload.isOpen ?? initialState.isOpen;
      state.content = action.payload.content ?? initialState.content;
      state.step = action.payload.step ?? initialState.step;
    },
  },
});

const { reducer, actions } = toastDialog;
export const { openToast } = actions;
export default reducer;
