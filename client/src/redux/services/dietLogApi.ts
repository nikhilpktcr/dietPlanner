import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addAuthHeader } from "../../utils/addAuthHeader";

export interface DietLog {
  _id: string;
  userId: string;
  dietPlanId: string;
  mealId: string;
  date: string;
  status: "taken" | "skipped" | "partial";
  loggedAt: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  meal?: {
    _id: string;
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  dietPlan?: {
    _id: string;
    startDate: string;
    endDate: string;
  };
}

export interface CreateDietLogPayload {
  userId: string;
  dietPlanId: string;
  mealId: string;
  date: string;
  status: "taken" | "skipped" | "partial";
  comments: string;
}

export interface UpdateDietLogPayload {
  status?: "taken" | "skipped" | "partial";
  comments?: string;
}

export interface GetDietLogsQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  dietPlanId?: string;
  mealId?: string;
  date?: string;
  status?: "taken" | "skipped" | "partial";
  startDate?: string;
  endDate?: string;
}

export interface DietLogsResponse {
  dietLogs: DietLog[];
  total: number;
  page: number;
  totalPages: number;
}

export const dietLogApi = createApi({
  reducerPath: "dietLogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: addAuthHeader,
  }),
  tagTypes: ["DietLog"],
  endpoints: (builder) => ({
    // Get all diet logs with pagination and filtering
    getDietLogs: builder.query<DietLogsResponse, GetDietLogsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
        return `diet-logs?${searchParams.toString()}`;
      },
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietLog"],
    }),

    // Get diet log by ID
    getDietLogById: builder.query<DietLog, string>({
      query: (id) => `diet-logs/${id}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietLog"],
    }),

    // Get user's diet logs for a specific date
    getUserDietLogsByDate: builder.query<
      DietLog[],
      { userId: string; date: string }
    >({
      query: ({ userId, date }) => `diet-logs/user/${userId}/date/${date}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietLog"],
    }),

    // Get user's diet logs for a date range
    getUserDietLogsByDateRange: builder.query<
      DietLog[],
      { userId: string; startDate: string; endDate: string }
    >({
      query: ({ userId, startDate, endDate }) =>
        `diet-logs/user/${userId}/range?startDate=${startDate}&endDate=${endDate}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietLog"],
    }),

    // Create new diet log
    createDietLog: builder.mutation<DietLog, CreateDietLogPayload>({
      query: (payload) => ({
        url: "diet-logs",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["DietLog"],
    }),

    // Update diet log
    updateDietLog: builder.mutation<
      DietLog,
      { id: string; payload: UpdateDietLogPayload }
    >({
      query: ({ id, payload }) => ({
        url: `diet-logs/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["DietLog"],
    }),

    // Delete diet log
    deleteDietLog: builder.mutation<void, string>({
      query: (id) => ({
        url: `diet-logs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DietLog"],
    }),

    // Get user's recent diet logs (for dashboard)
    getUserRecentDietLogs: builder.query<
      DietLog[],
      { userId: string; limit?: number }
    >({
      query: ({ userId, limit = 5 }) =>
        `diet-logs/user/${userId}/recent?limit=${limit}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietLog"],
    }),

    // Get user's diet log statistics
    getUserDietLogStats: builder.query<
      {
        totalLogs: number;
        takenCount: number;
        skippedCount: number;
        partialCount: number;
        totalCalories: number;
        totalProtein: number;
        totalCarbs: number;
        totalFats: number;
      },
      { userId: string; startDate?: string; endDate?: string }
    >({
      query: ({ userId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `diet-logs/user/${userId}/stats?${params.toString()}`;
      },
      transformResponse: (res: any) => res.data || res,
      providesTags: ["DietLog"],
    }),
  }),
});

export const {
  useGetDietLogsQuery,
  useGetDietLogByIdQuery,
  useGetUserDietLogsByDateQuery,
  useGetUserDietLogsByDateRangeQuery,
  useCreateDietLogMutation,
  useUpdateDietLogMutation,
  useDeleteDietLogMutation,
  useGetUserRecentDietLogsQuery,
  useGetUserDietLogStatsQuery,
} = dietLogApi;
