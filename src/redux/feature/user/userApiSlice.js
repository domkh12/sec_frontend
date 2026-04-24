import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const userAdapter = createEntityAdapter({});

const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query({
            query: ({ pageNo = 1, pageSize = 5, search = "", roleId = "", departmentId = "", status = "" }) => ({
                url: `/users?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}&roleId=${roleId}&departmentId=${departmentId}&status=${status}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedDept = responseData.content.map((user) => {
                    user.id = user.id;
                    return user;
                });
                return {
                    ...userAdapter.setAll(initialState, loadedDept),
                    totalPages: responseData.page.totalPages,
                    totalElements: responseData.page.totalElements,
                    pageNo: responseData.page.number,
                    pageSize: responseData.page.size,
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "User", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "User", id })),
                    ];
                } else return [{ type: "User", id: "LIST" }];
            },
        }),

        getUserStats: builder.query({
            query: () => ({
                url: `/users/stats`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "UserStats", id: "LIST" }],
        }),

        createUser: builder.mutation({
            query: (initialState) => ({
                url: "/users",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [
                { type: "User", id: "LIST" },
                { type: "UserStats", id: "LIST" },
                { type: "Department", id: "LIST" },
                { type: "ProductionLine", id: "LIST" }
            ],
        }),

        updateUser: builder.mutation({
            query: ({id, ...initialUserData}) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: {
                    ...initialUserData,
                },
            }),
            invalidatesTags: [
                {type: "User", id: "LIST"},
                { type: "UserStats", id: "LIST" },
                { type: "Department", id: "LIST" },
                { type: "ProductionLine", id: "LIST" }
            ],
        }),

        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: "LIST" },
                { type: "UserStats", id: "LIST" },
                { type: "Department", id: "LIST" },
                { type: "ProductionLine", id: "LIST" }
            ],
        }),

        getUserLookup: builder.query({
            query: () => ({
                url: `/users/lookup`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: "UserLookup", id: "LIST" }],
        }),

        setActive: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/active`,
                method: "PATCH",
            }),
        }),

        setInactive: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/inactive`,
                method: "PATCH",
            }),
        }),

        setBlockUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/block`,
                method: "POST",
            }),
        }),

        setUnblockUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/unblock`,
                method: "POST",
            }),
        }),

    }),
});

export const {
    useGetUserLookupQuery,
    useSetUnblockUserMutation,
    useSetBlockUserMutation,
    useGetUserStatsQuery,
    useSetInactiveMutation,
    useSetActiveMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useCreateUserMutation,
    useGetUserQuery,
} = userApiSlice;
