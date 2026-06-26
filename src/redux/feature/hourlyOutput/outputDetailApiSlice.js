import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const outputDetailAdapter = createEntityAdapter({});

const initialState = outputDetailAdapter.getInitialState();

export const outputDetailApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOutputDetail: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = ""}) => ({
                url: `/output-details?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedOutputDetail = responseData.content.map((outputDetail) => {
                    outputDetail.id = outputDetail.id;
                    return outputDetail;
                });
                return {
                    ...outputDetailAdapter.setAll(initialState, loadedOutputDetail),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "OutputDetail", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "OutputDetail", id })),
                    ];
                } else return [{ type: "OutputDetail", id: "LIST" }];
            },
        }),


        createOutputDetail: builder.mutation({
            query: (initialState) => ({
                url: "/output-details",
                method: "POST",
                body: [
                    ...initialState,
                ],
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "OutputDetail", id: "LIST" },
                { type: "WorkOrderByLine", id: "LIST"}
            ],
        }),


    }),
});

export const {
    useCreateOutputDetailMutation,
    useGetOutputDetailQuery
} = outputDetailApiSlice;
