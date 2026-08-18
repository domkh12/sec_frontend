import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const unitAdapter = createEntityAdapter({});

const initialState = unitAdapter.getInitialState();

export const unitApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUnit: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/units?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedUnit = responseData.content.map((unit) => {
                    unit.id = unit.id;
                    return unit;
                });
                return {
                    ...unitAdapter.setAll(initialState, loadedUnit),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Unit", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Unit", id })),
                    ];
                } else return [{ type: "Unit", id: "LIST" }];
            },
        }),

        createUnit: builder.mutation({
            query: (initialState) => ({
                url: "/units",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [
                {type: "Unit",       id: "LIST" },
                {type: "UnitLookup", id: "LIST"}
            ],
        }),

        updateUnit: builder.mutation({
            query: ({uuid, ...initialUnitData}) => ({
                url: `/units/${uuid}`,
                method: "PUT",
                body: {
                    ...initialUnitData,
                },
            }),
            invalidatesTags: [
                {type: "Unit", id: "LIST"},
                {type: "UnitLookup", id: "LIST"}
            ],
        }),

        deleteUnit: builder.mutation({
            query: ({ uuid }) => ({
                url: `/units/${uuid}`,
                method: "DELETE",
                body: {
                    uuid,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Unit", id: "LIST" }],
        }),

        getUnitLookup: builder.query({
            query: () => ({
                url: "/units/lookup",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "UnitLookup", id: "LIST" }],
        }),

    }),
});

export const {
    useGetUnitLookupQuery,
    useUpdateUnitMutation,
    useDeleteUnitMutation,
    useCreateUnitMutation,
    useGetUnitQuery,
} = unitApiSlice;
