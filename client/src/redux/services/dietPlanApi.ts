import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addAuthHeader } from "../../utils/addAuthHeader";

export interface DietPlan {
  _id: string;
  userId: string;
  daily: string[]; // Meal IDs
  weekly: string[]; // Meal IDs
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
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

export interface CreateDietPlanPayload {
  userId: string;
  daily: string[];
  weekly: string[];
  startDate: string;
  endDate: string;
}

export interface UpdateDietPlanPayload {
  daily?: string[];
  weekly?: string[];
  startDate?: string;
  endDate?: string;
}

export interface GetDietPlansQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface DietPlansResponse {
  dietPlans: DietPlan[];
  total: number;
  page: number;
  totalPages: number;
}

export const dietPlanApi = createApi({
  reducerPath: "dietPlanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: addAuthHeader,
  }),
  tagTypes: ["DietPlan"],
  endpoints: (builder) => ({
    // Get all diet plans with pagination
    getDietPlans: builder.query<DietPlansResponse, GetDietPlansQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
        return `diet-plans?${searchParams.toString()}`;
      },
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietPlan"],
    }),

    // Get diet plan by ID
    getDietPlanById: builder.query<DietPlan, string>({
      query: (id) => `diet-plans/${id}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietPlan"],
    }),

    // Get user's current diet plan
    getUserDietPlan: builder.query<DietPlan, string>({
      query: (userId) => `diet-plans/user/${userId}/current`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietPlan"],
    }),

    // Create new diet plan
    createDietPlan: builder.mutation<DietPlan, CreateDietPlanPayload>({
      query: (payload) => ({
        url: "diet-plans",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["DietPlan"],
    }),

    // Update diet plan
    updateDietPlan: builder.mutation<
      DietPlan,
      { id: string; payload: UpdateDietPlanPayload }
    >({
      query: ({ id, payload }) => ({
        url: `diet-plans/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["DietPlan"],
    }),

    // Delete diet plan
    deleteDietPlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `diet-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DietPlan"],
    }),

    // Generate diet plan based on user profile
    generateDietPlan: builder.mutation<DietPlan, string>({
      query: (userId) => ({
        url: `diet-plans/generate/${userId}`,
        method: "POST",
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["DietPlan"],
    }),
  }),
});

export const {
  useGetDietPlansQuery,
  useGetDietPlanByIdQuery,
  useGetUserDietPlanQuery,
  useCreateDietPlanMutation,
  useUpdateDietPlanMutation,
  useDeleteDietPlanMutation,
  useGenerateDietPlanMutation,
} = dietPlanApi;
