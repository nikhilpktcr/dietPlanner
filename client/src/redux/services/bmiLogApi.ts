import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addAuthHeader } from "../../utils/addAuthHeader";

export interface BMILog {
  _id: string;
  userId: string;
  weightCm: number;
  heightCm: number;
  category: "over weight" | "under weight" | "normal" | "obese";
  bmi: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBmiLogPayload {
  weightCm: number;
  heightCm: number;
}

export interface UpdateBmiLogPayload {
  weightCm?: number;
  heightCm?: number;
}

export interface BMILogResponse {
  logs: BMILog[];
  total: number;
  page: number;
  totalPages: number;
}

export const bmiLogsApi = createApi({
  reducerPath: "bmiLogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: addAuthHeader,
  }),
  tagTypes: ["BMILog"],
  endpoints: (builder) => ({
    // Get all BMI logs with pagination and filtering
    getBmiLogs: builder.query<
      BMILogResponse,
      { page?: number; limit?: number; searchCategory?: string }
    >({
      query: ({ page = 1, limit = 10, searchCategory }) => {
        let url = `bmi-logs?page=${page}&limit=${limit}`;
        if (searchCategory) url += `&searchCategory=${searchCategory}`;
        return url;
      },
      transformResponse: (res: any) => {
        // Handle different response structures
        if (res.data) return res.data;
        if (res.logs) return res;
        if (Array.isArray(res))
          return { logs: res, total: res.length, page: 1, totalPages: 1 };
        return res;
      },
      providesTags: ["BMILog"],
    }),

    // Get specific BMI log by ID
    getBmiLogById: builder.query<BMILog, string>({
      query: (id) => `bmi-logs/${id}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["BMILog"],
    }),

    // Create new BMI log
    createBmiLog: builder.mutation<BMILog, CreateBmiLogPayload>({
      query: (payload) => ({
        url: "bmi-logs",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["BMILog"],
    }),

    // Update BMI log
    updateBmiLog: builder.mutation<
      BMILog,
      { id: string; payload: UpdateBmiLogPayload }
    >({
      query: ({ id, payload }) => ({
        url: `bmi-logs/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["BMILog"],
    }),

    // Delete BMI log
    deleteBmiLog: builder.mutation<void, string>({
      query: (id) => ({
        url: `bmi-logs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BMILog"],
    }),
  }),
});

export const {
  useGetBmiLogsQuery,
  useGetBmiLogByIdQuery,
  useCreateBmiLogMutation,
  useUpdateBmiLogMutation,
  useDeleteBmiLogMutation,
} = bmiLogsApi;
