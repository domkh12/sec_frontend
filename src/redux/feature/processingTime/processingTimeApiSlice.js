import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const processingTimeAdapter = createEntityAdapter({});

const initialState = processingTimeAdapter.getInitialState();

export const processingTimeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProcessingTime: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/processing-times?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedProcessingTime = responseData.content.map((processingTime) => {
                    processingTime.id = processingTime.id;
                    return processingTime;
                });
                return {
                    ...processingTimeAdapter.setAll(initialState, loadedProcessingTime),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "ProcessingTime", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "ProcessingTime", id })),
                    ];
                } else return [{ type: "ProcessingTime", id: "LIST" }];
            },
        }),

        getProcessingTimetats: builder.query({
            query: () => ({
                url: `/processingTime/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "ProcessingTimetats", id: "LIST" }
            ],
        }),

        getProcessingTimeFiles: builder.query({
            query: ({id}) => ({
                url: `/processingTime/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "ProcessingTimeFile", id: "LIST" }
            ],
        }),

        getProcessingTimeLookup: builder.query({
            query: () => ({
                url: `/processing-times/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "ProcessingTimeLookup", id: "LIST" }],
        }),

        createProcessingTime: builder.mutation({
            query: (initialState) => ({
                url: "/processing-times",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "ProcessingTime", id: "LIST" },
                { type: "ProcessingTimeLookup", id: "LIST" }
            ],
        }),

        updateProcessingTime: builder.mutation({
            query: ({id, ...initialProcessingTimeData}) => ({
                url: `/processingTime/${id}`,
                method: "PUT",
                body: {
                    ...initialProcessingTimeData,
                },
            }),
            invalidatesTags: [
                {type: "ProcessingTime", id: "LIST"},
                { type: "ProcessingTimeLookup", id: "LIST" }
            ],
        }),

        uploadProcessingTimeFile: builder.mutation({
            query: ({id, ...initialProcessingTimeData}) => ({
                url: `/processingTime/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialProcessingTimeData,
                },
            }),
            invalidatesTags: [
                {type: "ProcessingTime", id: "LIST"},
                { type: "ProcessingTimeFile", id: "LIST" }
            ],
        }),

        deleteProcessingTime: builder.mutation({
            query: ({ id }) => ({
                url: `/processingTime/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "ProcessingTime", id: "LIST" },
                { type: "ProcessingTimeLookup", id: "LIST" },
                { type: "ProcessingTimetats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetProcessingTimeFilesQuery,
    useUploadProcessingTimeFileMutation,
    useGetProcessingTimetatsQuery,
    useGetProcessingTimeLookupQuery,
    useUpdateProcessingTimeMutation,
    useDeleteProcessingTimeMutation,
    useCreateProcessingTimeMutation,
    useGetProcessingTimeQuery,
} = processingTimeApiSlice;
