import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const fileAdapter = createEntityAdapter({});

const initialState = fileAdapter.getInitialState();

export const fileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        uploadFile: builder.mutation({
            query: (formData) => ({
                url: "/files",
                method: "POST",
                body: formData,
                formData: true
            }),
            // invalidatesTags: [{ type: "File", id: "LIST" }],
        }),

        uploadMultipleFile: builder.mutation({
            query: (formData) => ({
                url: "/files/multiple",
                method: "POST",
                body: formData,
                formData: true
            }),
        })
    }),
});

export const {
    useUploadMultipleFileMutation,
    useUploadFileMutation
} = fileApiSlice;
