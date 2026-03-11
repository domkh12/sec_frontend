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

    }),
});

export const {
    useUploadFileMutation
} = fileApiSlice;
