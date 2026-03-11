import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const roleAdapter = createEntityAdapter({});

const initialState = roleAdapter.getInitialState();

export const roleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRole: builder.query({
            query: ({ pageNo = 1, pageSize = 20 }) => ({
                url: `/roles?pageNo=${pageNo}&pageSize=${pageSize}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((role) => {
                    role.id = role.id;
                    return role;
                });
                return {
                    ...roleAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Role", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Role", id })),
                    ];
                } else return [{ type: "Role", id: "LIST" }];
            },
        }),

        createRole: builder.mutation({
            query: (initialState) => ({
                url: "/roles",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [{ type: "Role", id: "LIST" }],
        }),

        updateRole: builder.mutation({
            query: ({id, ...initialRoleData}) => ({
                url: `/roles/${id}`,
                method: "PUT",
                body: {
                    ...initialRoleData,
                },
            }),
            invalidatesTags: [{type: "Role", id: "LIST"}],
        }),

        deleteRole: builder.mutation({
            query: ({ id }) => ({
                url: `/roles/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Role", id: "LIST" }],
        }),

    }),
});

export const {
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useCreateRoleMutation,
    useGetRoleQuery,
} = roleApiSlice;
