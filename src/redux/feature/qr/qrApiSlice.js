import { apiSlice } from "../../app/api/apiSlice";

export const qrApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getQr: builder.mutation({
            query: (initialState) => ({
                url: "/qr/generateQRCode",
                method: "POST",
                body: {
                    ...initialState,
                },
                responseHandler: (response) => response.blob()
            })
        }),

    }),
});

export const {
    useGetQrMutation,
} = qrApiSlice;
