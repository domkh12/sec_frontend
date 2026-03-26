import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const colorAdapter = createEntityAdapter({});

const initialState = colorAdapter.getInitialState();

export const colorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getColor: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/colors?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedColor = responseData.content.map((color) => {
                    color.id = color.id;
                    return color;
                });
                return {
                    ...colorAdapter.setAll(initialState, loadedColor),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Color", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Color", id })),
                    ];
                } else return [{ type: "Color", id: "LIST" }];
            },
        }),

        getColorStats: builder.query({
            query: () => ({
                url: `/colors/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "ColorStats", id: "LIST" }
            ],
        }),

        getColorFiles: builder.query({
            query: ({id}) => ({
                url: `/colors/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "ColorFile", id: "LIST" }
            ],
        }),

        getColorLookup: builder.query({
            query: () => ({
                url: `/colors/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "ColorLookup", id: "LIST" }],
        }),

        createColor: builder.mutation({
            query: (initialState) => ({
                url: "/colors",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Color", id: "LIST" },
                { type: "ColorLookup", id: "LIST" },
                { type: "ColorStats", id: "LIST" }
            ],
        }),

        updateColor: builder.mutation({
            query: ({id, ...initialColorData}) => ({
                url: `/colors/${id}`,
                method: "PUT",
                body: {
                    ...initialColorData,
                },
            }),
            invalidatesTags: [
                {type: "Color", id: "LIST"},
                { type: "ColorLookup", id: "LIST" },
                { type: "ColorStats", id: "LIST" }
            ],
        }),

        uploadColorFile: builder.mutation({
            query: ({id, ...initialColorData}) => ({
                url: `/colors/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialColorData,
                },
            }),
            invalidatesTags: [
                {type: "Color", id: "LIST"},
                { type: "ColorFile", id: "LIST" }
            ],
        }),

        deleteColor: builder.mutation({
            query: ({ id }) => ({
                url: `/colors/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Color", id: "LIST" },
                { type: "ColorLookup", id: "LIST" },
                { type: "ColorStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetColorFilesQuery,
    useUploadColorFileMutation,
    useGetColorStatsQuery,
    useGetColorLookupQuery,
    useUpdateColorMutation,
    useDeleteColorMutation,
    useCreateColorMutation,
    useGetColorQuery,
} = colorApiSlice;
