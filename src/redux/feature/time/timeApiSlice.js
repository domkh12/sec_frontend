import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const timeAdapter = createEntityAdapter({});

const initialState = timeAdapter.getInitialState();

export const timeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTime: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "" }) => ({
                url: `/times?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedTime = responseData.content.map((time) => {
                    time.id = time.id;
                    return time;
                });
                return {
                    ...timeAdapter.setAll(initialState, loadedTime),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Time", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Time", id })),
                    ];
                } else return [{ type: "Time", id: "LIST" }];
            },
        }),

        getTimeLookup: builder.query({
            query: () => ({
                url: `/times/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "TimeLookup", id: "LIST" }],
        }),

        createTime: builder.mutation({
            query: (initialState) => ({
                url: "/times",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "Time", id: "LIST" },
                { type: "TimeLookup", id: "LIST" },
                { type: "TimeStats", id: "LIST" }
            ],
        }),

        updateTime: builder.mutation({
            query: ({id, ...initialTimeData}) => ({
                url: `/times/${id}`,
                method: "PUT",
                body: {
                    ...initialTimeData,
                },
            }),
            invalidatesTags: [
                {type: "Time", id: "LIST"},
                { type: "TimeLookup", id: "LIST" },
                { type: "TimeStats", id: "LIST" }
            ],
        }),

        deleteTime: builder.mutation({
            query: ({ id }) => ({
                url: `/times/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Time", id: "LIST" },
                { type: "TimeLookup", id: "LIST" },
                { type: "TimeStats", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useGetTimeLookupQuery,
    useUpdateTimeMutation,
    useDeleteTimeMutation,
    useCreateTimeMutation,
    useGetTimeQuery,
} = timeApiSlice;
