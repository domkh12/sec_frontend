import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const productionlineAdapter = createEntityAdapter({});

const initialState = productionlineAdapter.getInitialState();

export const productionlineApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductionLine: builder.query({
            query: ({ pageNo = 1, pageSize = 5, search = "", departmentId = "" }) => ({
                url: `/production-lines?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}&departmentId=${departmentId}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((prodL) => {
                    prodL.id = prodL.id;
                    return prodL;
                });
                return {
                    ...productionlineAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "ProductionLine", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "ProductionLine", id })),
                    ];
                } else return [{ type: "ProductionLine", id: "LIST" }];
            },
        }),

        createProductionLine: builder.mutation({
            query: (initialState) => ({
                url: "/production-lines",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [
                { type: "ProductionLine", id: "LIST" },
                { type: "DeptLookup", id: "LIST" },
                { type: "Department", id: "LIST" },
            ],
        }),

        updateProductionLine: builder.mutation({
            query: ({id, ...initialProductionLineData}) => ({
                url: `/production-lines/${id}`,
                method: "PUT",
                body: {
                    ...initialProductionLineData,
                },
            }),
            invalidatesTags: [
                {type: "ProductionLine", id: "LIST"},
                { type: "DeptLookup", id: "LIST" },
                { type: "Department", id: "LIST" },
            ],
        }),

        deleteProductionLine: builder.mutation({
            query: ({ id }) => ({
                url: `/production-lines/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "ProductionLine", id: "LIST" },
                { type: "DeptLookup", id: "LIST" },
                { type: "Department", id: "LIST" },
            ],
        }),

    }),
});

export const {
    useUpdateProductionLineMutation,
    useDeleteProductionLineMutation,
    useCreateProductionLineMutation,
    useGetProductionLineQuery,
} = productionlineApiSlice;
