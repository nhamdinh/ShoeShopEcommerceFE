/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ACCESSTOKEN_STORAGE, API_LINK } from "../../../utils/constants";

export const productsApi = createApi({
  reducerPath: "productsApis",
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
  tagTypes: ["GetProducts", "GetProductsDetail", "GetCategorys"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => ({
        url: `/products/all`,
        method: "GET",
        params: data,
      }),
      providesTags: ["GetProducts"],
    }),
    getProductsDetail: builder.query({
      query: (data) => ({
        url: `/products/detail/${data.id}`,
        method: "GET",
      }),
      providesTags: ["GetProductsDetail"],
    }),
    createReviewProduct: builder.mutation({
      query: (data) => ({
        url: `/products/${data.productId}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GetProductsDetail"],
    }),
    checkIsBuyer: builder.query({
      query: (data) => ({
        url: `/products/${data.id}/user-buyer`,
        method: "GET",
      }),
    }),
    getBrands: builder.query({
      query: (data) => ({
        url: `/categorys/get-all-brands`,
        method: "GET",
      }),
    }),

    createCo: builder.mutation({
      query: (data) => ({
        url: `/cookie`,
        method: "POST",
        // body: data,
      }),
    }),
    getPublishedProducts: builder.query({
      query: (data) => ({
        url: `/products/published/all`,
        method: "GET",
        params: data,
      }),
    }),
    getCo: builder.query({
      query: (data) => ({
        url: `/cookie`,
        method: "GET",
        // body: data,
      }),
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `/products/create`,
        method: "POST",
        body: data,
      }),
    }),
    getCategorys: builder.query({
      query: (data) => ({
        url: `/categorys/all-admin`,
        method: "GET",
      }),
      providesTags: ["GetCategorys"],
    }),
    uploadImg: builder.mutation({
      query: (data) => ({
        url: `/upload?folder=${data?.folder}`,
        method: "POST",
        body: data?.formData,
      }),
    }),
    getCodes: builder.query({
      query: (data) => ({
        url: `/codes/all`,
        method: "GET",
        params: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCodesQuery,
  useGetPublishedProductsQuery,
  useGetProductsDetailQuery,
  useCreateReviewProductMutation,
  useCreateProductMutation,
  useGetCategorysQuery,
  useUploadImgMutation,
  useCreateCoMutation,
  useCheckIsBuyerQuery,
  useGetBrandsQuery,
  useGetCoQuery,
} = productsApi;
