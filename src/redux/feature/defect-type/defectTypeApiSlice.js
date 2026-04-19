import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const defectTypeAdapter = createEntityAdapter({});

const initialState = defectTypeAdapter.getInitialState();

export const defectTypeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDefectType: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/defect-types?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDefectType = responseData.content.map((defectType) => {
                    defectType.id = defectType.id;
                    return defectType;
                });
                return {
                    ...defectTypeAdapter.setAll(initialState, loadedDefectType),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "DefectType", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "DefectType", id })),
                    ];
                } else return [{ type: "DefectType", id: "LIST" }];
            },
        }),

        getDefectTypeStats: builder.query({
            query: () => ({
                url: `/defect-types/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "DefectTypeStats", id: "LIST" }
            ],
        }),

        getDefectTypeFiles: builder.query({
            query: ({id}) => ({
                url: `/defect-types/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "DefectTypeFile", id: "LIST" }
            ],
        }),

        getDefectTypeLookup: builder.query({
            query: () => ({
                url: `/defect-types/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "DefectTypeLookup", id: "LIST" }],
        }),

        createDefectType: builder.mutation({
            query: (initialState) => ({
                url: "/defect-types",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "DefectType", id: "LIST" },
                { type: "DefectTypeLookup", id: "LIST" },
                { type: "DefectTypeStats", id: "LIST" }
            ],
        }),

        updateDefectType: builder.mutation({
            query: ({id, ...initialDefectTypeData}) => ({
                url: `/defect-types/${id}`,
                method: "PUT",
                body: {
                    ...initialDefectTypeData,
                },
            }),
            invalidatesTags: [
                {type: "DefectType", id: "LIST"},
                { type: "DefectTypeLookup", id: "LIST" },
                { type: "DefectTypeStats", id: "LIST" }
            ],
        }),

        uploadDefectTypeFile: builder.mutation({
            query: ({id, ...initialDefectTypeData}) => ({
                url: `/defect-types/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialDefectTypeData,
                },
            }),
            invalidatesTags: [
                {type: "DefectType", id: "LIST"},
                { type: "DefectTypeFile", id: "LIST" }
            ],
        }),

        deleteDefectType: builder.mutation({
            query: ({ id }) => ({
                url: `/defect-types/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "DefectType", id: "LIST" },
                { type: "DefectTypeLookup", id: "LIST" },
                { type: "DefectTypeStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetDefectTypeFilesQuery,
    useUploadDefectTypeFileMutation,
    useGetDefectTypeStatsQuery,
    useGetDefectTypeLookupQuery,
    useUpdateDefectTypeMutation,
    useDeleteDefectTypeMutation,
    useCreateDefectTypeMutation,
    useGetDefectTypeQuery,
} = defectTypeApiSlice;
