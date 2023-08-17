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
      const accessToken = localStorage.getItem(ACCESSTOKEN_STORAGE);

      // Add token to headers
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      //   headers.set("x-api-key", `${apiKey}`);

      return headers;
    },
  }),
  tagTypes: ["GetProducts", "GetProductsDetail"],
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (data) => ({
        url: `carts/create-cart`,
        method: "POST",
      }),
    }),
    checkAddress: builder.mutation({
      query: (data) => ({
        url: `address/check-address`,
        method: "POST",
      }),
    }),
    createAddress: builder.mutation({
      query: (data) => ({
        url: `address/create-address`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateCartMutation,
  useCheckAddressMutation,
  useCreateAddressMutation,
} = ordersApi;
