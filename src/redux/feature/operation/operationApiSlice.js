import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const operationAdapter = createEntityAdapter({});

const initialState = operationAdapter.getInitialState();

export const operationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOperation: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/operations?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedOperation = responseData.content.map((operation) => {
                    operation.id = operation.id;
                    return operation;
                });
                return {
                    ...operationAdapter.setAll(initialState, loadedOperation),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Operation", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Operation", id })),
                    ];
                } else return [{ type: "Operation", id: "LIST" }];
            },
        }),

        getOperationStats: builder.query({
            query: () => ({
                url: `/operations/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "OperationStats", id: "LIST" }
            ],
        }),

        getOperationFiles: builder.query({
            query: ({id}) => ({
                url: `/operations/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "OperationFile", id: "LIST" }
            ],
        }),

        getOperationLookup: builder.query({
            query: () => ({
                url: `/operations/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "OperationLookup", id: "LIST" }],
        }),

        createOperation: builder.mutation({
            query: (initialState) => ({
                url: "/operations",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Operation", id: "LIST" },
                { type: "OperationLookup", id: "LIST" },
                { type: "OperationStats", id: "LIST" }
            ],
        }),

        updateOperation: builder.mutation({
            query: ({id, ...initialOperationData}) => ({
                url: `/operations/${id}`,
                method: "PUT",
                body: {
                    ...initialOperationData,
                },
            }),
            invalidatesTags: [
                {type: "Operation", id: "LIST"},
                { type: "OperationLookup", id: "LIST" },
                { type: "OperationStats", id: "LIST" }
            ],
        }),

        uploadOperationFile: builder.mutation({
            query: ({id, ...initialOperationData}) => ({
                url: `/operations/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialOperationData,
                },
            }),
            invalidatesTags: [
                {type: "Operation", id: "LIST"},
                { type: "OperationFile", id: "LIST" }
            ],
        }),

        deleteOperation: builder.mutation({
            query: ({ id }) => ({
                url: `/operations/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Operation", id: "LIST" },
                { type: "OperationLookup", id: "LIST" },
                { type: "OperationStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetOperationFilesQuery,
    useUploadOperationFileMutation,
    useGetOperationStatsQuery,
    useGetOperationLookupQuery,
    useUpdateOperationMutation,
    useDeleteOperationMutation,
    useCreateOperationMutation,
    useGetOperationQuery,
} = operationApiSlice;
