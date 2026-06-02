import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const analysisAdapter = createEntityAdapter({});

const initialState = analysisAdapter.getInitialState();

export const analysisApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAnalysis: builder.query({
            query: () => ({
                url: `/analysis`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedAnalysis = responseData.content.map((analysis) => {
                    analysis.id = analysis.id;
                    return analysis;
                });
                return {
                    ...analysisAdapter.setAll(initialState, loadedAnalysis),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Analysis", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Analysis", id })),
                    ];
                } else return [{ type: "Analysis", id: "LIST" }];
            },
        }),

        getOutputToday: builder.query({
            query: () => ({
                url: `/analysis/output-today`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "OutputToday", id: "LIST" }
            ],
        }),


    }),
});

export const {
    useGetAnalysisQuery,
    useGetOutputTodayQuery
} = analysisApiSlice;
