import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const categoryAdapter = createEntityAdapter({});

const initialState = categoryAdapter.getInitialState();

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategory: builder.query({
            query: ({ pageNo = 1, pageSize = 20 }) => ({
                url: `/categories?pageNo=${pageNo}&pageSize=${pageSize}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((category) => {
                    category.id = category.id;
                    return category;
                });
                return {
                    ...categoryAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Category", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Category", id })),
                    ];
                } else return [{ type: "Category", id: "LIST" }];
            },
        }),

        createCategory: builder.mutation({
            query: (initialState) => ({
                url: "/categories",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Category", id: "LIST" },
                { type: "Product", id: "LIST" }
            ],
        }),

        updateCategory: builder.mutation({
            query: ({id, ...initialCategoryData}) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: {
                    ...initialCategoryData,
                },
            }),
            invalidatesTags: [{type: "Category", id: "LIST"}],
        }),

        deleteCategory: builder.mutation({
            query: ({ id }) => ({
                url: `/categories/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Category", id: "LIST" }],
        }),

    }),
});

export const {
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateCategoryMutation,
    useGetCategoryQuery,
} = categoryApiSlice;
