import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const productAdapter = createEntityAdapter({});

const initialState = productAdapter.getInitialState();

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/products?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((product) => {
                    product.id = product.id;
                    return product;
                });
                return {
                    ...productAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Product", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Product", id })),
                    ];
                } else return [{ type: "Product", id: "LIST" }];
            },
        }),

        createProduct: builder.mutation({
            query: (initialState) => ({
                url: "/products",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [
                { type: "Product", id: "LIST" }
            ],
        }),

        updateProduct: builder.mutation({
            query: ({id, ...initialProductData}) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: {
                    ...initialProductData,
                },
            }),
            invalidatesTags: [{type: "Product", id: "LIST"}],
        }),

        deleteProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/products/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Product", id: "LIST" }],
        }),

        getProductStats: builder.query({
            query: () => ({
                url: `/products/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "ProductStats", id: "LIST" }],
        }),


    }),
});

export const {
    useGetProductStatsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateProductMutation,
    useGetProductQuery,
} = productApiSlice;
