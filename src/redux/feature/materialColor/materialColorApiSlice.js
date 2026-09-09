import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const materialColorAdapter = createEntityAdapter({});

const initialState = materialColorAdapter.getInitialState();

export const materialColorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMaterialColor: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/material-colors?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
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
                url: `/material-colors/stats`,
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
                url: `/material-colors/${id}/files`,
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
                url: `/material-colors/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "MaterialColorLookup", id: "LIST" }],
        }),

        createMaterialColor: builder.mutation({
            query: (initialState) => ({
                url: "/material-colors",
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
            query: ({uuid, ...initialMaterialColorData}) => ({
                url: `/material-colors/${uuid}`,
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

        deleteMaterialColor: builder.mutation({
            query: ({ uuid }) => ({
                url: `/material-colors/${uuid}`,
                method: "DELETE",
                body: {
                    uuid,
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
    useGetMaterialColorLookupQuery,
    useUpdateMaterialColorMutation,
    useDeleteMaterialColorMutation,
    useCreateMaterialColorMutation,
    useGetMaterialColorQuery,
} = materialColorApiSlice;
