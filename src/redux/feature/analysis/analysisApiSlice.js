import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const analysisAdapter = createEntityAdapter({});

const initialState = analysisAdapter.getInitialState();

export const analysisApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getAnalysis: builder.query({
            query: ({dateFrom = "", dateTo = ""}) => ({
                url: `/analysis?dateFrom=${dateFrom}&dateTo=${dateTo}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "Analysis", id: "LIST" }
            ],
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

        getDefectToday: builder.query({
            query: () => ({
                url: `/analysis/defect-today`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "DefectToday", id: "LIST" }
            ],
        }),

        getOutputLast48hrs: builder.query({
            query: () => ({
                url: `/analysis/last48hrs`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [
                { type: "OutputLast48hrs", id: "LIST" }
            ],
        }),

        

    }),
});

export const {
    useGetDefectTodayQuery,
    useGetOutputLast48hrsQuery,
    useGetAnalysisQuery,
    useGetOutputTodayQuery
} = analysisApiSlice;
