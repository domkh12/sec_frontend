import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const warehouseAdapter = createEntityAdapter({});

const initialState = warehouseAdapter.getInitialState();

export const warehouseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWarehouse: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/warehouses?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedWarehouse = responseData.content.map((warehouse) => {
                    warehouse.id = warehouse.id;
                    return warehouse;
                });
                return {
                    ...warehouseAdapter.setAll(initialState, loadedWarehouse),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Warehouse", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Warehouse", id })),
                    ];
                } else return [{ type: "Warehouse", id: "LIST" }];
            },
        }),

        createWarehouse: builder.mutation({
            query: (initialState) => ({
                url: "/warehouses",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [{ type: "Warehouse", id: "LIST" }],
        }),

        updateWarehouse: builder.mutation({
            query: ({id, ...initialWarehouseData}) => ({
                url: `/warehouses/${id}`,
                method: "PUT",
                body: {
                    ...initialWarehouseData,
                },
            }),
            invalidatesTags: [{type: "Warehouse", id: "LIST"}],
        }),

        deleteWarehouse: builder.mutation({
            query: ({ id }) => ({
                url: `/warehouses/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Warehouse", id: "LIST" }],
        }),

    }),
});

export const {
    useUpdateWarehouseMutation,
    useDeleteWarehouseMutation,
    useCreateWarehouseMutation,
    useGetWarehouseQuery,
} = warehouseApiSlice;
