import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const defectDetailAdapter = createEntityAdapter({});

const initialState = defectDetailAdapter.getInitialState();

export const defectDetailApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDefectDetail: builder.query({
            query: ({ pageNo = 1, pageSize = 20, search = "", reportDate = "", lineId = "", buyerId = ""}) => ({
                url: `/defect-details?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}&lineId=${lineId}&reportDate=${reportDate}&buyerId=${buyerId}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDefectDetail = responseData.content.map((defectDetail) => {
                    defectDetail.id = defectDetail.id;
                    return defectDetail;
                });
                return {
                    ...defectDetailAdapter.setAll(initialState, loadedDefectDetail),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },

            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "DefectDetail", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "DefectDetail", id })),
                    ];
                } else return [{ type: "DefectDetail", id: "LIST" }];
            },
        }),

        deleteDefectDetail: builder.mutation({
            query: ({id}) => ({
                url: `/defect-details/${id}`,
                method: "DELETE",
                body: [
                    id,
                ],
            }),
            invalidatesTags:(result, error, arg) => [
                { type: "DefectDetail", id: "LIST" }
            ],
        }),

    }),
});

export const {
    useDeleteDefectDetailMutation,
    useGetDefectDetailQuery
} = defectDetailApiSlice;
