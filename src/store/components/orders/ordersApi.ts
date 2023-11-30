/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ACCESSTOKEN_STORAGE, API_LINK } from "../../../utils/constants";

export const ordersApi = createApi({
  reducerPath: "ordersApis",

  baseQuery: fetchBaseQuery({
    baseUrl: API_LINK,
    // credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Get token from store (userSlice)
      // @ts-ignore
      //   const apiKey = process.env.REACT_APP_API_KEY;
      const accessToken = localStorage.getItem(ACCESSTOKEN_STORAGE)
        ? localStorage.getItem(ACCESSTOKEN_STORAGE)
        : null;

      // Add token to headers
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      //   headers.set("x-api-key", `${apiKey}`);

      return headers;
    },
  }),
  tagTypes: ["getOrderDetail__TAG", "checkCart__TAG"],
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (data) => ({
        url: `carts/add-to-cart`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["checkCart__TAG"],
    }),
    removeFromCart: builder.mutation({
      query: (data) => ({
        url: `carts/${data.cartId}/remove`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["checkCart__TAG"],
    }),
    checkCart: builder.query({
      query: (data) => ({
        url: `carts/get-current-cart`,
        method: "GET",
      }),
      providesTags: ["checkCart__TAG"],
    }),
    checkAddress: builder.query({
      query: (data) => ({
        url: `address/check-address`,
        method: "GET",
      }),
    }),
    createAddress: builder.mutation({
      query: (data) => ({
        url: `address/create-address`,
        method: "POST",
        body: data,
      }),
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `orders/create-order`,
        method: "POST",
        body: data,
      }),
    }),
    getOrderDetail: builder.query({
      query: (data) => ({
        url: `orders/detail/${data.orderId}`,
        method: "GET",
      }),
      providesTags: ["getOrderDetail__TAG"],
    }),
    payOrder: builder.mutation({
      query: (data) => ({
        url: `orders/${data.orderId}/pay`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["getOrderDetail__TAG"],
    }),
    getOrderUser: builder.query({
      query: (data) => ({
        url: `orders/all`,
        method: "GET",
      }),
    }),
    checkoutCart: builder.mutation({
      query: (data) => ({
        url: `orders/checkout-cart`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateCartMutation,
  useCheckCartQuery,
  useCheckAddressQuery,
  useCreateAddressMutation,
  useCreateOrderMutation,
  useCheckoutCartMutation,
  useGetOrderDetailQuery,
  usePayOrderMutation,
  useGetOrderUserQuery,
  useRemoveFromCartMutation,
} = ordersApi;
