import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const materialAdapter = createEntityAdapter({});

const initialState = materialAdapter.getInitialState();

export const materialApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMaterial: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "", status = "" }) => ({
                url: `/materials?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}&status=${status}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedMaterial = responseData.content.map((material) => {
                    material.id = material.id;
                    return material;
                });
                return {
                    ...materialAdapter.setAll(initialState, loadedMaterial),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Material", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Material", id })),
                    ];
                } else return [{ type: "Material", id: "LIST" }];
            },
        }),

        getMaterialStats: builder.query({
            query: () => ({
                url: `/materials/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "MaterialStats", id: "LIST" }
            ],
        }),

        getMaterialFiles: builder.query({
            query: ({id}) => ({
                url: `/materials/${id}/files`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "MaterialFile", id: "LIST" }
            ],
        }),

        getMaterialLookup: builder.query({
            query: () => ({
                url: `/materials/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "MaterialLookup", id: "LIST" }],
        }),

        getStockIn: builder.query({
            query: ({materialId, pageNo = 1, pageSize = 20, search = ""}) => ({
                url: `/materials/${materialId}/stock-in?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
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
                    ...materialAdapter.setAll(initialState, loadedStockIn),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "MaterialStockIn", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "MaterialStockIn", id })),
                    ];
                } else return [{ type: "MaterialStockIn", id: "LIST" }];
            },
        }),

        getStockOut: builder.query({
            query: ({materialId, pageNo = 1, pageSize = 20, search = ""}) => ({
                url: `/materials/${materialId}/stock-out?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
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
                    ...materialAdapter.setAll(initialState, loadedStockOut),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "MaterialStockOut", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "MaterialStockOut", id })),
                    ];
                } else return [{ type: "MaterialStockOut", id: "LIST" }];
            },
        }),

        createMaterial: builder.mutation({
            query: (initialState) => ({
                url: "/materials",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Material", id: "LIST" },
                { type: "MaterialLookup", id: "LIST" },
                { type: "MaterialStats", id: "LIST" }
            ],
        }),

        stockIn: builder.mutation({
            query: (initialState) => ({
                url: "/materials/stock-in",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Material", id: "LIST" },
                { type: "MaterialStockIn", id: "LIST" },
            ],
        }),

        stockOut: builder.mutation({
            query: (initialState) => ({
                url: "/materials/stock-out",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Material", id: "LIST" },
                { type: "MaterialStockOut", id: "LIST" },
            ],
        }),

        updateMaterial: builder.mutation({
            query: ({id, ...initialMaterialData}) => ({
                url: `/materials/${id}`,
                method: "PUT",
                body: {
                    ...initialMaterialData,
                },
            }),
            invalidatesTags: [
                {type: "Material", id: "LIST"},
                { type: "MaterialLookup", id: "LIST" },
                { type: "MaterialStats", id: "LIST" }
            ],
        }),

        uploadMaterialFile: builder.mutation({
            query: ({id, ...initialMaterialData}) => ({
                url: `/materials/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialMaterialData,
                },
            }),
            invalidatesTags: [
                {type: "Material", id: "LIST"},
                { type: "MaterialFile", id: "LIST" }
            ],
        }),

        deleteMaterial: builder.mutation({
            query: ({ id }) => ({
                url: `/materials/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Material", id: "LIST" },
                { type: "MaterialLookup", id: "LIST" },
                { type: "MaterialStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useStockOutMutation,
    useGetStockOutQuery,
    useGetStockInQuery,
    useStockInMutation,
    useGetMaterialFilesQuery,
    useUploadMaterialFileMutation,
    useGetMaterialStatsQuery,
    useGetMaterialLookupQuery,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation,
    useCreateMaterialMutation,
    useGetMaterialQuery,
} = materialApiSlice;
