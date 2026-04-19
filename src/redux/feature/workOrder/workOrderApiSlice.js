import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const workOrderAdapter = createEntityAdapter({});

const initialState = workOrderAdapter.getInitialState();

export const workOrderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWorkOrder: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/work-orders?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedWorkOrder = responseData.content.map((workOrder) => {
                    workOrder.id = workOrder.id;
                    return workOrder;
                });
                return {
                    ...workOrderAdapter.setAll(initialState, loadedWorkOrder),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "WorkOrder", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "WorkOrder", id })),
                    ];
                } else return [{ type: "WorkOrder", id: "LIST" }];
            },
        }),

        getWorkOrderStats: builder.query({
            query: () => ({
                url: `/work-orders/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "WorkOrderStats", id: "LIST" }
            ],
        }),

        getWorkOrderFiles: builder.query({
            query: ({id}) => ({
                url: `/work-orders/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "WorkOrderFile", id: "LIST" }
            ],
        }),

        getWorkOrderLookup: builder.query({
            query: () => ({
                url: `/work-orders/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "WorkOrderLookup", id: "LIST" }],
        }),

        getStyleByMo: builder.mutation({
            query: ({mo}) => ({
                url: `/work-orders/style/${mo}`,

            }),
        }),

        createWorkOrder: builder.mutation({
            query: (initialState) => ({
                url: "/work-orders",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "WorkOrder", id: "LIST" },
                { type: "WorkOrderLookup", id: "LIST" },
                { type: "WorkOrderStats", id: "LIST" }
            ],
        }),

        updateWorkOrder: builder.mutation({
            query: ({id, ...initialWorkOrderData}) => ({
                url: `/work-orders/${id}`,
                method: "PUT",
                body: {
                    ...initialWorkOrderData,
                },
            }),
            invalidatesTags: [
                {type: "WorkOrder", id: "LIST"},
                { type: "WorkOrderLookup", id: "LIST" },
                { type: "WorkOrderStats", id: "LIST" }
            ],
        }),

        deleteWorkOrder: builder.mutation({
            query: ({ id }) => ({
                url: `/work-orders/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "WorkOrder", id: "LIST" },
                { type: "WorkOrderLookup", id: "LIST" },
                { type: "WorkOrderStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetStyleByMoMutation,
    useUploadWorkOrderFileMutation,
    useGetWorkOrderStatsQuery,
    useGetWorkOrderLookupQuery,
    useUpdateWorkOrderMutation,
    useDeleteWorkOrderMutation,
    useCreateWorkOrderMutation,
    useGetWorkOrderQuery,
} = workOrderApiSlice;
