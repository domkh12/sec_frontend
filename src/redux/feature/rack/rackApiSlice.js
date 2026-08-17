import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const rackAdapter = createEntityAdapter({});

const initialState = rackAdapter.getInitialState();

export const rackApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRack: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/racks?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedRack = responseData.content.map((rack) => {
                    rack.id = rack.id;
                    return rack;
                });
                return {
                    ...rackAdapter.setAll(initialState, loadedRack),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Rack", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Rack", id })),
                    ];
                } else return [{ type: "Rack", id: "LIST" }];
            },
        }),

        createRack: builder.mutation({
            query: (initialState) => ({
                url: "/racks",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [{ type: "Rack", id: "LIST" }],
        }),

        updateRack: builder.mutation({
            query: ({uuid, ...initialRackData}) => ({
                url: `/racks/${uuid}`,
                method: "PUT",
                body: {
                    ...initialRackData,
                },
            }),
            invalidatesTags: [{type: "Rack", id: "LIST"}],
        }),

        deleteRack: builder.mutation({
            query: ({ uuid }) => ({
                url: `/racks/${uuid}`,
                method: "DELETE",
                body: {
                    uuid,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Rack", id: "LIST" }],
        }),

    }),
});

export const {
    useUpdateRackMutation,
    useDeleteRackMutation,
    useCreateRackMutation,
    useGetRackQuery,
} = rackApiSlice;
