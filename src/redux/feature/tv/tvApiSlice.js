import { apiSlice } from "../../app/api/apiSlice";

export const tvsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTv: builder.query({
            query: () => ({
                url: `/tvs`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                console.log(responseData);
                return responseData;
            },
            providesTags: (result) => {
                if (result?.ids) {
                    return [
                        { type: "Tv", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Tv", id })),
                    ];
                } else return [{ type: "Tv", id: "LIST" }];
            },
        }),

        getTvData: builder.query({
            query: ({name}) => ({
                url: `/tvs/${name}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: (result) => {
                if (result?.ids) {
                    return [
                        { type: "TvData", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "TvData", id })),
                    ];
                } else return [{ type: "TvData", id: "LIST" }];
            },
        }),

        getTvGeneralData: builder.query({
            query: () => ({
                url: `/tvs/tv-general`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: (result) => {
                if (result?.ids) {
                    return [
                        { type: "TvGeneralData", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "TvGeneralData", id })),
                    ];
                } else return [{ type: "TvGeneralData", id: "LIST" }];
            },
        }),

        createTv: builder.mutation({
            query: (initialState) => ({
                url: "/tvs",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [{ type: "Tv", id: "LIST" }],
        }),

        createTvData: builder.mutation({
            query: ({name, tvOrderId}) => ({
                url: `/tvs/data/${name}`,
                method: "POST",
                params: { tvOrderId },
            }),
            invalidatesTags: [{ type: "TvData", id: "LIST" }],
        }),

        createNewStyle: builder.mutation({
            query: ({name}) => ({
                url: `/tvs/data/${name}/style`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "TvData", id: "LIST" }],
        }),

        updateTvData: builder.mutation({
            query: (initialState) => ({
                url: `/tvs/data`,
                method: "PUT",
                body: {
                    ...initialState
                },
            }),
            invalidatesTags: [{ type: "TvData", id: "LIST" }],
        }),

        updateTv: builder.mutation({
            query: ({id, ...initialTvData}) => ({
                url: `/tvs/${id}`,
                method: "PUT",
                body: {
                    ...initialTvData,
                },
            }),
            invalidatesTags: [{type: "Tv", id: "LIST"}],
        }),

        deleteTv: builder.mutation({
            query: ({ id }) => ({
                url: `/tvs/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: [{ type: "Tv", id: "LIST" }],
        }),

        createOrder: builder.mutation({
            query: ({tvName, styleId}) => ({
                url: `/tvs/orders`,
                method: "POST",
                params: { tvName, styleId },
            }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                { type: "TvData", id: "LIST" },
            ],
        }),

    }),
});

export const {
    useCreateOrderMutation,
    useCreateNewStyleMutation,
    useUpdateTvDataMutation,
    useGetTvGeneralDataQuery,
    useCreateTvDataMutation,
    useGetTvDataQuery,
    useGetTvQuery,
    useCreateTvMutation,
} = tvsApiSlice;
