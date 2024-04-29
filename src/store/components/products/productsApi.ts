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
  tagTypes: [
    "GetProducts",
    "GetProductsMax",
    "GetProductsDetail",
    "GetCategorys",
    "tag_getPublishedProducts",
    "tag_getDraftProducts",
    "getByProduct_tag",
  ],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => ({
        url: `/products/all`,
        method: "GET",
        params: data,
      }),
      providesTags: ["GetProducts"],
    }),

    getProductsMax: builder.query({
      query: (data) => ({
        url: `/products/all-max`,
        method: "GET",
        params: data,
      }),
      providesTags: ["GetProductsMax"],
    }),

    getProductsDetail: builder.query({
      query: (data) => ({
        url: `/products/detail/${data.id}`,
        method: "GET",
      }),
      providesTags: ["GetProductsDetail"],
    }),
    getByProduct: builder.query({
      query: (data) => ({
        url: `/reviews/get-by-product/${data.productId}`,
        method: "GET",
      }),
      providesTags: ["getByProduct_tag"],
    }),
    createReviewProduct: builder.mutation({
      query: (data) => ({
        url: `/products/${data.productId}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getByProduct_tag", "GetProductsDetail"],
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
      providesTags: ["tag_getPublishedProducts"],
    }),
    getDraftProducts: builder.query({
      query: (data) => ({
        url: `/products/draft/all`,
        method: "GET",
        params: data,
      }),
      providesTags: ["tag_getDraftProducts"],
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
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["GetProductsMax"],
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
        url: `/uploads/file?folder=${data?.folder}`,
        method: "POST",
        body: data?.formData,
      }),
    }),
    uploadImgUrl: builder.mutation({
      query: (data) => ({
        url: `/uploads/url`,
        method: "POST",
        body: data,
      }),
    }),
    getCodes: builder.query({
      query: (data) => ({
        url: `/codes/all`,
        method: "GET",
        params: data,
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `/products/update/${data.productId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["GetProductsMax"],
      // invalidatesTags: ["GetProductsDetail"],
    }),
    deleteProduct: builder.mutation({
      query: (data) => ({
        url: `/products/draft/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tag_getPublishedProducts"],
    }),
    publishProduct: builder.mutation({
      query: (data) => ({
        url: `/products/published/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tag_getDraftProducts"],
    }),
    getAllBrandByCategories: builder.mutation({
      query: (data) => ({
        url: `/categorys/get-all-brands-categories`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsMaxQuery,
  useGetCodesQuery,
  useGetPublishedProductsQuery,
  useGetDraftProductsQuery,
  useGetProductsDetailQuery,
  useGetByProductQuery,
  useCreateReviewProductMutation,
  useCreateProductMutation,
  useGetCategorysQuery,
  useUploadImgMutation,
  useUploadImgUrlMutation,
  useCreateCoMutation,
  useCheckIsBuyerQuery,
  useGetBrandsQuery,
  useGetCoQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  usePublishProductMutation,
  useGetAllBrandByCategoriesMutation,
} = productsApi;
