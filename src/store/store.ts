import {
  configureStore,
  isRejectedWithValue,
  MiddlewareAPI,
  Middleware,
} from "@reduxjs/toolkit";
import { couponsApi } from "./components/coupons/couponsApi";
// import couponsReducer from "./components/coupons/couponsSlice";
import { productsApi } from "./components/products/productsApi";
import productsReducer from "./components/products/productsSlice";
import { ordersApi } from "./components/orders/ordersApi";
import ordersReducer from "./components/orders/ordersSlice";

import { authApi } from "./components/auth/authApi";
import authReducer, { userLogout } from "./components/auth/authSlice";
import toastReducer from "./components/customDialog/toastSlice";
import dialogReducer from "./components/customDialog/dialogSlice";

/*import authReducer, { userLogout } from "../pages/Auth/authSlice";
import modalReducer from "../components/customModal/modalSlice";
import { memberApi } from "../pages/MemberManagement/memberApi";
import { settlementApi } from "../pages/SettlementManagement/settlementApi";
import { dispatchApi } from "../pages/DispatchManagement/dispatchApi";
import { notificationApi } from "../pages/NoticeManagement/notificationApi";
import { faqApi } from "../pages/FaqManagement/faqApi";
import { advertisementApi } from "../pages/AdvertisementManagement/advertisementApi"; */
const rootReducer = {
  [productsApi.reducerPath]: productsApi.reducer,
  [couponsApi.reducerPath]: couponsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  /*  [memberApi.reducerPath]: memberApi.reducer,
  [settlementApi.reducerPath]: settlementApi.reducer,
  [dispatchApi.reducerPath]: dispatchApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [faqApi.reducerPath]: faqApi.reducer,
  [advertisementApi.reducerPath]: advertisementApi.reducer,
  modal: modalReducer,*/
  dialog: dialogReducer,
  cart: productsReducer,
  order: ordersReducer,
  toastR: toastReducer,
};
const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      /*       console.log("rtkQueryErrorLogger", action);
       */ // unauthorized
      if (action.payload.status === 401) {
        /*       api.dispatch(userLogout());
        window.location.href = "/login"; */
      }
    }
    return next(action);
  };

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      rtkQueryErrorLogger,
      ordersApi.middleware,
      productsApi.middleware,
      couponsApi.middleware,
      authApi.middleware,
      /*  memberApi.middleware,
      settlementApi.middleware,
      dispatchApi.middleware,
      notificationApi.middleware,
      faqApi.middleware,
      advertisementApi.middleware, */
    ]),
});

export default store;
