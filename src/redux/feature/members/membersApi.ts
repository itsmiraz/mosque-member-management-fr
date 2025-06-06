import { baseApi } from "@/redux/api/baseApi";
export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};
const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new member
    createMember: builder.mutation({
      query: (payload) => ({
        url: "/member/create-new-member",
        method: "POST",
        body: payload,
      }),
      invalidatesTags:['members']
    }),
    getSingleMember: builder.query({
      query: (memberId) => ({
        url: `/member/${memberId}`,
        method: "GET",
      }),
      providesTags:['member']
    }),
    // Get all members
    getAllMembers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((element: TQueryParam) => {
            if (Array.isArray(element.value)) {
              // If value is an array, append each item separately as a query parameter
              element.value.forEach((item: string) => {
                params.append(element.name, item as string);
              });
            } else {
              // Otherwise, append the value normally
              params.append(element.name, element.value as string);
            }
          });
        }

        return {
          url: "/member",
          method: "GET",
          params,
        };
      },
      providesTags:['members']
    }),

    // Get members by meat status
    getMembersByMeatStatus: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((element: TQueryParam) => {
            if (Array.isArray(element.value)) {
              // If value is an array, append each item separately as a query parameter
              element.value.forEach((item: string) => {
                params.append(element.name, item as string);
              });
            } else {
              // Otherwise, append the value normally
              params.append(element.name, element.value as string);
            }
          });
        }

        return {
          url: "/member/meat-status",
          method: "GET",
          params,
        };
      },
      providesTags:["meatStatus"]
    }),

    // Mark meat taken
    markMeatTaken: builder.mutation({
      query: (payload) => ({
        url: "/member/meat-taken",
        method: "POST",
        body: payload,
      }),
      invalidatesTags:["meatStatus","member"]
    }),
    // Mark meat taken
    markAsNotTakenMeat: builder.mutation({
      query: (payload) => ({
        url: "/member/un-taken-meat",
        method: "POST",
        body: payload,
      }),
      invalidatesTags:["meatStatus","member"]
    }),

    // Pay membership fee
    payMembershipFee: builder.mutation({
      query: (payload) => ({
        url: "/member/payment",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateMemberMutation,
  useGetAllMembersQuery,
  useGetMembersByMeatStatusQuery,
  useMarkMeatTakenMutation,
  usePayMembershipFeeMutation,
  useGetSingleMemberQuery,
  useMarkAsNotTakenMeatMutation
} = memberApi;
