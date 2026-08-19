import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const supplierAdapter = createEntityAdapter({});

const initialState = supplierAdapter.getInitialState();

export const supplierApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSupplier: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/suppliers?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedSupplier = responseData.content.map((supplier) => {
                    supplier.id = supplier.id;
                    return supplier;
                });
                return {
                    ...supplierAdapter.setAll(initialState, loadedSupplier),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Supplier", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Supplier", id })),
                    ];
                } else return [{ type: "Supplier", id: "LIST" }];
            },
        }),

        createSupplier: builder.mutation({
            query: (initialState) => ({
                url: "/suppliers",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [
                {type: "Supplier",       id: "LIST" },
                {type: "SupplierLookup", id: "LIST"}
            ],
        }),

        updateSupplier: builder.mutation({
            query: ({uuid, ...initialSupplierData}) => ({
                url: `/suppliers/${uuid}`,
                method: "PUT",
                body: {
                    ...initialSupplierData,
                },
            }),
            invalidatesTags: [
                {type: "Supplier", id: "LIST"},
                {type: "SupplierLookup", id: "LIST"}
            ],
        }),

        deleteSupplier: builder.mutation({
            query: ({ uuid }) => ({
                url: `/suppliers/${uuid}`,
                method: "DELETE",
                body: {
                    uuid,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Supplier", id: "LIST" }],
        }),

        getSupplierLookup: builder.query({
            query: () => ({
                url: "/suppliers/lookup",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "SupplierLookup", id: "LIST" }],
        }),

    }),
});

export const {
    useGetSupplierLookupQuery,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
    useCreateSupplierMutation,
    useGetSupplierQuery,
} = supplierApiSlice;
