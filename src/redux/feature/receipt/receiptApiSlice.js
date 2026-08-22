import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const receiptAdapter = createEntityAdapter({});

const initialState = receiptAdapter.getInitialState();

export const receiptApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReceipt: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/receipts?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedReceipt = responseData.content.map((receipt) => {
                    receipt.id = receipt.id;
                    return receipt;
                });
                return {
                    ...receiptAdapter.setAll(initialState, loadedReceipt),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Receipt", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Receipt", id })),
                    ];
                } else return [{ type: "Receipt", id: "LIST" }];
            },
        }),

        createReceipt: builder.mutation({
            query: (initialState) => ({
                url: "/receipts",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [
                {type: "Receipt",       id: "LIST" },
                {type: "ReceiptLookup", id: "LIST"}
            ],
        }),

        updateReceipt: builder.mutation({
            query: ({uuid, ...initialReceiptData}) => ({
                url: `/receipts/${uuid}`,
                method: "PUT",
                body: {
                    ...initialReceiptData,
                },
            }),
            invalidatesTags: [
                {type: "Receipt", id: "LIST"},
                {type: "ReceiptLookup", id: "LIST"}
            ],
        }),

        deleteReceipt: builder.mutation({
            query: ({ uuid }) => ({
                url: `/receipts/${uuid}`,
                method: "DELETE",
                body: {
                    uuid,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Receipt", id: "LIST" }],
        }),

        getReceiptLookup: builder.query({
            query: () => ({
                url: "/receipts/lookup",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "ReceiptLookup", id: "LIST" }],
        }),

    }),
});

export const {
    useGetReceiptLookupQuery,
    useUpdateReceiptMutation,
    useDeleteReceiptMutation,
    useCreateReceiptMutation,
    useGetReceiptQuery,
} = receiptApiSlice;
