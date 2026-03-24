import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const buyerAdapter = createEntityAdapter({});

const initialState = buyerAdapter.getInitialState();

export const buyerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBuyer: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/buyers?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedBuyer = responseData.content.map((buyer) => {
                    buyer.id = buyer.id;
                    return buyer;
                });
                return {
                    ...buyerAdapter.setAll(initialState, loadedBuyer),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Buyer", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Buyer", id })),
                    ];
                } else return [{ type: "Buyer", id: "LIST" }];
            },
        }),

        getBuyerStats: builder.query({
            query: () => ({
                url: `/buyers/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "BuyerStats", id: "LIST" }
            ],
        }),

        getBuyerLookup: builder.query({
            query: () => ({
                url: `/buyers/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "BuyerLookup", id: "LIST" }],
        }),

        createBuyer: builder.mutation({
            query: (initialState) => ({
                url: "/buyers",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Buyer", id: "LIST" },
                { type: "BuyerLookup", id: "LIST" },
                { type: "BuyerStats", id: "LIST" }
            ],
        }),

        updateBuyer: builder.mutation({
            query: ({id, ...initialBuyerData}) => ({
                url: `/buyers/${id}`,
                method: "PUT",
                body: {
                    ...initialBuyerData,
                },
            }),
            invalidatesTags: [
                {type: "Buyer", id: "LIST"},
                { type: "BuyerLookup", id: "LIST" },
                { type: "BuyerStats", id: "LIST" }
            ],
        }),

        uploadBuyerFile: builder.mutation({
            query: ({id, ...initialBuyerData}) => ({
                url: `/buyers/${id}/file-upload`,
                method: "PUT",
                body: {
                    ...initialBuyerData,
                },
            }),
            invalidatesTags: [
                {type: "Buyer", id: "LIST"},
            ],
        }),

        deleteBuyer: builder.mutation({
            query: ({ id }) => ({
                url: `/buyers/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Buyer", id: "LIST" },
                { type: "BuyerLookup", id: "LIST" },
                { type: "BuyerStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useUploadBuyerFileMutation,
    useGetBuyerStatsQuery,
    useGetBuyerLookupQuery,
    useUpdateBuyerMutation,
    useDeleteBuyerMutation,
    useCreateBuyerMutation,
    useGetBuyerQuery,
} = buyerApiSlice;
