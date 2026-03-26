import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const sizeAdapter = createEntityAdapter({});

const initialState = sizeAdapter.getInitialState();

export const sizeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSize: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/sizes?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedSize = responseData.content.map((size) => {
                    size.id = size.id;
                    return size;
                });
                return {
                    ...sizeAdapter.setAll(initialState, loadedSize),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Size", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Size", id })),
                    ];
                } else return [{ type: "Size", id: "LIST" }];
            },
        }),

        getSizeStats: builder.query({
            query: () => ({
                url: `/sizes/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "SizeStats", id: "LIST" }
            ],
        }),

        getSizeFiles: builder.query({
            query: ({id}) => ({
                url: `/sizes/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "SizeFile", id: "LIST" }
            ],
        }),

        getSizeLookup: builder.query({
            query: () => ({
                url: `/sizes/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "SizeLookup", id: "LIST" }],
        }),

        createSize: builder.mutation({
            query: (initialState) => ({
                url: "/sizes",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Size", id: "LIST" },
                { type: "SizeLookup", id: "LIST" },
                { type: "Sizestats", id: "LIST" }
            ],
        }),

        updateSize: builder.mutation({
            query: ({id, ...initialSizeData}) => ({
                url: `/sizes/${id}`,
                method: "PUT",
                body: {
                    ...initialSizeData,
                },
            }),
            invalidatesTags: [
                {type: "Size", id: "LIST"},
                { type: "SizeLookup", id: "LIST" },
                { type: "Sizestats", id: "LIST" }
            ],
        }),

        uploadSizeFile: builder.mutation({
            query: ({id, ...initialSizeData}) => ({
                url: `/sizes/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialSizeData,
                },
            }),
            invalidatesTags: [
                {type: "Size", id: "LIST"},
                { type: "SizeFile", id: "LIST" }
            ],
        }),

        deleteSize: builder.mutation({
            query: ({ id }) => ({
                url: `/sizes/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Size", id: "LIST" },
                { type: "SizeLookup", id: "LIST" },
                { type: "Sizestats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetSizeFilesQuery,
    useUploadSizeFileMutation,
    useGetSizeStatsQuery,
    useGetSizeLookupQuery,
    useUpdateSizeMutation,
    useDeleteSizeMutation,
    useCreateSizeMutation,
    useGetSizeQuery,
} = sizeApiSlice;
