import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addAuthHeader } from "../../utils/addAuthHeader";

export interface UserProfile {
  _id?: string;
  userId: string;
  heightCm: number;
  weightCm: number;
  dietaryPreferences: "veg" | "non veg";
  allergies: string[];
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very active";
  healthGoals: "weightLoss" | "weightGain" | "maintenance";
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateUserProfilePayload {
  userId?: string;
  heightCm: number;
  weightCm: number;
  dietaryPreferences: "veg" | "non veg";
  allergies: string[];
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very active";
  healthGoals: "weightLoss" | "weightGain" | "maintenance";
}

export interface UpdateUserProfilePayload {
  userId?: string;
  heightCm?: number;
  weightCm?: number;
  dietaryPreferences?: "veg" | "non veg";
  allergies?: string[];
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very active";
  healthGoals?: "weightLoss" | "weightGain" | "maintenance";
}

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: addAuthHeader,
  }),
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    // Create user profile
    createUserProfile: builder.mutation<UserProfile, CreateUserProfilePayload>({
      query: (payload) => ({
        url: "user-profiles/create",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: any) => res.response || res.data || res,
      invalidatesTags: ["UserProfile"],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<
      UserProfile,
      { userId: string; payload: UpdateUserProfilePayload }
    >({
      query: ({ userId, payload }) => ({
        url: `user-profiles/update/${userId}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: any) => res.response || res.data || res,
      invalidatesTags: ["UserProfile"],
    }),

    // Get user profile
    getUserProfile: builder.query<UserProfile, string>({
      query: (userId) => `user-profiles/get/${userId}`,
      transformResponse: (res: any) => res.response || res.data || res,
      providesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
} = userProfileApi;
