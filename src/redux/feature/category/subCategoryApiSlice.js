import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const subCategoryAdapter = createEntityAdapter({});

const initialState = subCategoryAdapter.getInitialState();

export const subCategoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubCategory: builder.query({
            query: ({ pageNo = 1, pageSize = 20 }) => ({
                url: `/categories?pageNo=${pageNo}&pageSize=${pageSize}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((subCategory) => {
                    subCategory.id = subCategory.id;
                    return subCategory;
                });
                return {
                    ...subCategoryAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "SubCategory", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "SubCategory", id })),
                    ];
                } else return [{ type: "SubCategory", id: "LIST" }];
            },
        }),

        createSubCategory: builder.mutation({
            query: (initialState) => ({
                url: "/sub-categories",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "SubCategory", id: "LIST" },
                { type: "Product", id: "LIST" },
                { type: "Category", id: "LIST" },
                { type: "CategoryLookup", id: "LIST" }
            ],
        }),

        updateSubCategory: builder.mutation({
            query: ({id, ...initialSubCategoryData}) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: {
                    ...initialSubCategoryData,
                },
            }),
            invalidatesTags: [
                {type: "SubCategory", id: "LIST"},
                { type: "Category", id: "LIST" },
                { type: "CategoryLookup", id: "LIST" }
            ],
        }),

        deleteSubCategory: builder.mutation({
            query: ({ id }) => ({
                url: `/sub-categories/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "SubCategory", id: "LIST" },
                { type: "Category", id: "LIST" },
                { type: "CategoryLookup", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useCreateSubCategoryMutation,
    useGetSubCategoryQuery,
} = subCategoryApiSlice;
