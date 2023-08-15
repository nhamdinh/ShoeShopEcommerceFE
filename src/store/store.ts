import {
  configureStore,
  isRejectedWithValue,
  MiddlewareAPI,
  Middleware,
} from "@reduxjs/toolkit";
import { productsApi } from "./components/products/productsApi";
import { authApi } from "./components/auth/authApi";
import authReducer, { userLogout } from "./components/auth/authSlice";

/*import authReducer, { userLogout } from "../pages/Auth/authSlice";
import modalReducer from "../components/customModal/modalSlice";
import dialogReducer from "../components/customDialog/dialogSlice";
import { memberApi } from "../pages/MemberManagement/memberApi";
import { settlementApi } from "../pages/SettlementManagement/settlementApi";
import { dispatchApi } from "../pages/DispatchManagement/dispatchApi";
import { notificationApi } from "../pages/NoticeManagement/notificationApi";
import { faqApi } from "../pages/FaqManagement/faqApi";
import { advertisementApi } from "../pages/AdvertisementManagement/advertisementApi"; */
const rootReducer = {
  [productsApi.reducerPath]: productsApi.reducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  /*  [memberApi.reducerPath]: memberApi.reducer,
  [settlementApi.reducerPath]: settlementApi.reducer,
  [dispatchApi.reducerPath]: dispatchApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [faqApi.reducerPath]: faqApi.reducer,
  [advertisementApi.reducerPath]: advertisementApi.reducer,
  modal: modalReducer,
  dialog: dialogReducer, */
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
      productsApi.middleware,
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
