import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const materialColorAdapter = createEntityAdapter({});

const initialState = materialColorAdapter.getInitialState();

export const materialColorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMaterialColor: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/materialColors?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedMaterialColor = responseData.content.map((materialColor) => {
                    materialColor.id = materialColor.id;
                    return materialColor;
                });
                return {
                    ...materialColorAdapter.setAll(initialState, loadedMaterialColor),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "MaterialColor", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "MaterialColor", id })),
                    ];
                } else return [{ type: "MaterialColor", id: "LIST" }];
            },
        }),

        getMaterialColorStats: builder.query({
            query: () => ({
                url: `/materialColors/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "MaterialColorStats", id: "LIST" }
            ],
        }),

        getMaterialColorFiles: builder.query({
            query: ({id}) => ({
                url: `/materialColors/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "MaterialColorFile", id: "LIST" }
            ],
        }),

        getMaterialColorLookup: builder.query({
            query: () => ({
                url: `/materialColors/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "MaterialColorLookup", id: "LIST" }],
        }),

        createMaterialColor: builder.mutation({
            query: (initialState) => ({
                url: "/materialColors",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "MaterialColor", id: "LIST" },
                { type: "MaterialColorLookup", id: "LIST" },
                { type: "MaterialColorStats", id: "LIST" }
            ],
        }),

        updateMaterialColor: builder.mutation({
            query: ({id, ...initialMaterialColorData}) => ({
                url: `/materialColors/${id}`,
                method: "PUT",
                body: {
                    ...initialMaterialColorData,
                },
            }),
            invalidatesTags: [
                {type: "MaterialColor", id: "LIST"},
                { type: "MaterialColorLookup", id: "LIST" },
                { type: "MaterialColorStats", id: "LIST" }
            ],
        }),

        uploadMaterialColorFile: builder.mutation({
            query: ({id, ...initialMaterialColorData}) => ({
                url: `/materialColors/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialMaterialColorData,
                },
            }),
            invalidatesTags: [
                {type: "MaterialColor", id: "LIST"},
                { type: "MaterialColorFile", id: "LIST" }
            ],
        }),

        deleteMaterialColor: builder.mutation({
            query: ({ id }) => ({
                url: `/materialColors/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "MaterialColor", id: "LIST" },
                { type: "MaterialColorLookup", id: "LIST" },
                { type: "MaterialColorStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetMaterialColorFilesQuery,
    useUploadMaterialColorFileMutation,
    useGetMaterialColorStatsQuery,
    useGetMaterialColorLookupQuery,
    useUpdateMaterialColorMutation,
    useDeleteMaterialColorMutation,
    useCreateMaterialColorMutation,
    useGetMaterialColorQuery,
} = materialColorApiSlice;
