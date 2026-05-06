import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const purchaseOrderAdapter = createEntityAdapter({});

const initialState = purchaseOrderAdapter.getInitialState();

export const purchaseOrderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPurchaseOrder: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/purchase-orders?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedPurchaseOrder = responseData.content.map((purchaseOrder) => {
                    purchaseOrder.id = purchaseOrder.id;
                    return purchaseOrder;
                });
                return {
                    ...purchaseOrderAdapter.setAll(initialState, loadedPurchaseOrder),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "PurchaseOrder", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "PurchaseOrder", id })),
                    ];
                } else return [{ type: "PurchaseOrder", id: "LIST" }];
            },
        }),

        getPurchaseOrderStats: builder.query({
            query: () => ({
                url: `/purchase-orders/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "PurchaseOrderStats", id: "LIST" }
            ],
        }),

        getPurchaseOrderFiles: builder.query({
            query: ({id}) => ({
                url: `/purchase-orders/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "PurchaseOrderFile", id: "LIST" }
            ],
        }),

        getPurchaseOrderLookup: builder.query({
            query: () => ({
                url: `/purchase-orders/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "PurchaseOrderLookup", id: "LIST" }],
        }),

        getStyleByMo: builder.mutation({
            query: ({mo}) => ({
                url: `/purchase-orders/style/${mo}`,

            }),
        }),

        createPurchaseOrder: builder.mutation({
            query: (initialState) => ({
                url: "/purchase-orders",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "PurchaseOrder", id: "LIST" },
                { type: "PurchaseOrderLookup", id: "LIST" },
                { type: "PurchaseOrderStats", id: "LIST" }
            ],
        }),

        updatePurchaseOrder: builder.mutation({
            query: ({id, ...initialPurchaseOrderData}) => ({
                url: `/purchase-orders/${id}`,
                method: "PUT",
                body: {
                    ...initialPurchaseOrderData,
                },
            }),
            invalidatesTags: [
                {type: "PurchaseOrder", id: "LIST"},
                { type: "PurchaseOrderLookup", id: "LIST" },
                { type: "PurchaseOrderStats", id: "LIST" }
            ],
        }),

        deletePurchaseOrder: builder.mutation({
            query: ({ id }) => ({
                url: `/purchase-orders/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "PurchaseOrder", id: "LIST" },
                { type: "PurchaseOrderLookup", id: "LIST" },
                { type: "PurchaseOrderStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetStyleByMoMutation,
    useUploadPurchaseOrderFileMutation,
    useGetPurchaseOrderStatsQuery,
    useGetPurchaseOrderLookupQuery,
    useUpdatePurchaseOrderMutation,
    useDeletePurchaseOrderMutation,
    useCreatePurchaseOrderMutation,
    useGetPurchaseOrderQuery,
} = purchaseOrderApiSlice;
