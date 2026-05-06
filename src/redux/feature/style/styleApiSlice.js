import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const styleAdapter = createEntityAdapter({});

const initialState = styleAdapter.getInitialState();

export const styleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStyle: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "", status = ""}) => ({
                url: `/styles?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}&status=${status}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((style) => {
                    style.id = style.id;
                    return style;
                });
                return {
                    ...styleAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Style", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Style", id })),
                    ];
                } else return [{ type: "Style", id: "LIST" }];
            },
        }),

        createStyle: builder.mutation({
            query: (initialState) => ({
                url: "/styles",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [
                { type: "Style", id: "LIST" },
                { type: "StyleStats", id: "LIST" }
            ],
        }),

        updateStyle: builder.mutation({
            query: ({id, ...initialStyleData}) => ({
                url: `/styles/${id}`,
                method: "PUT",
                body: {
                    ...initialStyleData,
                },
            }),
            invalidatesTags: [{type: "Style", id: "LIST"}],
        }),

        deleteStyle: builder.mutation({
            query: ({ id }) => ({
                url: `/styles/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Style", id: "LIST" }],
        }),

        getStyleStats: builder.query({
            query: () => ({
                url: `/styles/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "StyleStats", id: "LIST" }],
        }),

        getStyleLookup: builder.query({
            query: () => ({
                url: `/styles/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "StyleLookup", id: "LIST" }],
        }),

    }),
});

export const {
    useGetStyleLookupQuery,
    useGetStyleStatsQuery,
    useUpdateStyleMutation,
    useDeleteStyleMutation,
    useCreateStyleMutation,
    useGetStyleQuery,
} = styleApiSlice;
