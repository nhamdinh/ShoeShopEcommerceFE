/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ACCESSTOKEN_STORAGE, API_LINK } from "../../../utils/constants";

export const couponsApi = createApi({
  reducerPath: "couponsApis",
  baseQuery: fetchBaseQuery({
    baseUrl: API_LINK,
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

      // headers.set("Content-Type", `application/json`);

      return headers;
    },
    // credentials: "include",
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => ({
        url: `/products/all`,
        method: "GET",
        params: data,
      }),
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: `/discounts/create`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetProductsQuery, useCreateCouponMutation } = couponsApi;
