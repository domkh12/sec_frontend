import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const outputDetailAdapter = createEntityAdapter({});

const initialState = outputDetailAdapter.getInitialState();

export const outputDetailApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOutputDetail: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "", status = "", color = "", size = "", unit = "" }) => ({
                url: `/outputDetails?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}&status=${status}&color=${color}&size=${size}&unit=${unit}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedOutputDetail = responseData.content.map((outputDetail) => {
                    outputDetail.id = outputDetail.id;
                    return outputDetail;
                });
                return {
                    ...outputDetailAdapter.setAll(initialState, loadedOutputDetail),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "OutputDetail", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "OutputDetail", id })),
                    ];
                } else return [{ type: "OutputDetail", id: "LIST" }];
            },
        }),

        getOutputDetailStats: builder.query({
            query: () => ({
                url: `/outputDetails/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "OutputDetailStats", id: "LIST" }
            ],
        }),

        getOutputDetailStockInExcel: builder.mutation({
           query: ({id}) => ({
               url: `/outputDetails/${id}/report-stock-in-excel`,
               validateStatus: (response, result) => {
                   return response.status === 200 && !result.isError;
               },
               responseHandler: (response) => response.blob(),
           })
        }),

        getOutputDetailStockOutExcel: builder.mutation({
            query: ({id}) => ({
                url: `/outputDetails/${id}/report-stock-out-excel`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
                responseHandler: (response) => response.blob(),
            })
        }),

        getOutputDetailReportExcel: builder.mutation({
            query: () => ({
                url: `/outputDetails/report-excel`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
                responseHandler: (response) => response.blob(),
            }),
        }),

        getOutputDetailFiles: builder.query({
            query: ({id}) => ({
                url: `/outputDetails/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "OutputDetailFile", id: "LIST" }
            ],
        }),

        getOutputDetailLookup: builder.query({
            query: () => ({
                url: `/outputDetails/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "OutputDetailLookup", id: "LIST" }],
        }),

        getStockIn: builder.query({
            query: ({outputDetailId, pageNo = 1, pageSize = 20, search = ""}) => ({
                url: `/outputDetails/${outputDetailId}/stock-in?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedStockIn = responseData.content.map((stockIn) => {
                    stockIn.id = stockIn.id;
                    return stockIn;
                });
                return {
                    ...outputDetailAdapter.setAll(initialState, loadedStockIn),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "OutputDetailStockIn", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "OutputDetailStockIn", id })),
                    ];
                } else return [{ type: "OutputDetailStockIn", id: "LIST" }];
            },
        }),

        getStockOut: builder.query({
            query: ({outputDetailId, pageNo = 1, pageSize = 20, search = ""}) => ({
                url: `/outputDetails/${outputDetailId}/stock-out?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedStockOut = responseData.content.map((stockOut) => {
                    stockOut.id = stockOut.id;
                    return stockOut;
                });
                return {
                    ...outputDetailAdapter.setAll(initialState, loadedStockOut),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "OutputDetailStockOut", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "OutputDetailStockOut", id })),
                    ];
                } else return [{ type: "OutputDetailStockOut", id: "LIST" }];
            },
        }),

        createOutputDetail: builder.mutation({
            query: (initialState) => ({
                url: "/output-details",
                method: "POST",
                body: [
                    ...initialState,
                ],
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "OutputDetail", id: "LIST" }
            ],
        }),

        stockIn: builder.mutation({
            query: (initialState) => ({
                url: "/outputDetails/stock-in",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "OutputDetail", id: "LIST" },
                { type: "OutputDetailStockIn", id: "LIST" },
                { type: "OutputDetailLookup", id: "LIST" },
                { type: "OutputDetailStats", id: "LIST" }
            ],
        }),

        stockOut: builder.mutation({
            query: (initialState) => ({
                url: "/outputDetails/stock-out",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "OutputDetail", id: "LIST" },
                { type: "OutputDetailStockOut", id: "LIST" },
                { type: "OutputDetailLookup", id: "LIST" },
                { type: "OutputDetailStats", id: "LIST" }
            ],
        }),

        updateOutputDetail: builder.mutation({
            query: ({id, ...initialOutputDetailData}) => ({
                url: `/outputDetails/${id}`,
                method: "PUT",
                body: {
                    ...initialOutputDetailData,
                },
            }),
            invalidatesTags: [
                {type: "OutputDetail", id: "LIST"},
                { type: "OutputDetailLookup", id: "LIST" },
                { type: "OutputDetailStats", id: "LIST" }
            ],
        }),

        uploadOutputDetailFile: builder.mutation({
            query: ({id, ...initialOutputDetailData}) => ({
                url: `/outputDetails/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialOutputDetailData,
                },
            }),
            invalidatesTags: [
                {type: "OutputDetail", id: "LIST"},
                { type: "OutputDetailFile", id: "LIST" }
            ],
        }),

        deleteOutputDetail: builder.mutation({
            query: ({ id }) => ({
                url: `/outputDetails/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "OutputDetail", id: "LIST" },
                { type: "OutputDetailLookup", id: "LIST" },
                { type: "OutputDetailStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetOutputDetailStockOutExcelMutation,
    useGetOutputDetailStockInExcelMutation,
    useGetOutputDetailReportExcelMutation,
    useStockOutMutation,
    useGetStockOutQuery,
    useGetStockInQuery,
    useStockInMutation,
    useGetOutputDetailFilesQuery,
    useUploadOutputDetailFileMutation,
    useGetOutputDetailStatsQuery,
    useGetOutputDetailLookupQuery,
    useUpdateOutputDetailMutation,
    useDeleteOutputDetailMutation,
    useCreateOutputDetailMutation,
    useGetOutputDetailQuery,
} = outputDetailApiSlice;
