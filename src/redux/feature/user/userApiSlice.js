import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const userAdapter = createEntityAdapter({});

const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query({
            query: ({ pageNo = 1, pageSize = 5 }) => ({
                url: `/users?pageNo=${pageNo}&pageSize=${pageSize}`,
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

        createUser: builder.mutation({
            query: (initialState) => ({
                url: "/users",
                method: "POST",
                body: {
                    ...initialState,
                },
            }),
            invalidatesTags: [{ type: "User", id: "LIST" }],
        }),

        updateUser: builder.mutation({
            query: ({id, ...initialUserData}) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: {
                    ...initialUserData,
                },
            }),
            invalidatesTags: [{type: "User", id: "LIST"}],
        }),

        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: "DELETE",
                body: {
                    id,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
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

    }),
});

export const {
    useSetInactiveMutation,
    useSetActiveMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useCreateUserMutation,
    useGetUserQuery,
} = userApiSlice;
