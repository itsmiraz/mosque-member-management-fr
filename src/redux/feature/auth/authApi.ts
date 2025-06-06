import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register-user",
        method: "POST",
        body: payload,
      }),
    }),
    resendOtp: builder.mutation({
      query: (payload) => ({
        url: `/auth/resend-otp?email=${payload.email}`,
        method: "POST",
      
      }),
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: payload,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation
} = authApi;
