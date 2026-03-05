import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const departmentAdapter = createEntityAdapter({});

const initialState = departmentAdapter.getInitialState();

export const departmentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDepartment: builder.query({
            query: ({ pageNo = 1, pageSize = 5 }) => ({
                url: `/departments?pageNo=${pageNo}&pageSize=${pageSize}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((dept) => {
                    dept.id = dept.id;
                    return dept;
                });
                return {
                    ...departmentAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Department", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Department", id })),
                    ];
                } else return [{ type: "Department", id: "LIST" }];
            },
        }),

        createDepartment: builder.mutation({
            query: (initialState) => ({
                url: "/departments",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [{ type: "Department", id: "LIST" }],
        }),

        updateDepartment: builder.mutation({
            query: ({id, ...initialDepartmentData}) => ({
                url: `/departments/${id}`,
                method: "PUT",
                body: {
                    ...initialDepartmentData,
                },
            }),
            invalidatesTags: [{type: "Department", id: "LIST"}],
        }),

        deleteDepartment: builder.mutation({
            query: ({ id }) => ({
                url: `/departments/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Department", id: "LIST" }],
        }),

    }),
});

export const {
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
    useCreateDepartmentMutation,
    useGetDepartmentQuery,
} = departmentApiSlice;
