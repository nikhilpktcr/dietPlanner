import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addAuthHeader } from "../../utils/addAuthHeader";

export interface Meal {
  _id: string;
  title: string;
  type: "veg" | "non veg";
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  mealInGrams: number;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tags: "weightLoss" | "weightGain" | "maintenance";
  ingredients: string[];
  status: "active" | "in active" | "deleted";
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedByUser?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateMealPayload {
  title: string;
  type: "veg" | "non veg";
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  mealInGrams: number;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tags: "weightLoss" | "weightGain" | "maintenance";
  ingredients: string[];
  status: "active" | "in active" | "deleted";
}

export interface UpdateMealPayload {
  title?: string;
  type?: "veg" | "non veg";
  mealType?: "breakfast" | "lunch" | "dinner" | "snacks";
  mealInGrams?: number;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  tags?: "weightLoss" | "weightGain" | "maintenance";
  ingredients?: string[];
  status?: "active" | "in active" | "deleted";
}

export interface GetMealsQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: string;
  offset?: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snacks";
  type?: "veg" | "non veg";
  tags?: "weightLoss" | "weightGain" | "maintenance";
  status?: "active" | "in active" | "deleted";
}

export interface MealsResponse {
  meals: Meal[];
  total: number;
  page: number;
  totalPages: number;
}

export const mealApi = createApi({
  reducerPath: "mealApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: addAuthHeader,
  }),
  tagTypes: ["Meal"],
  endpoints: (builder) => ({
    // Get all meals with filtering and pagination
    getMeals: builder.query<MealsResponse, GetMealsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
        return `meals/getAll?${searchParams.toString()}`;
      },
      transformResponse: (res: any) => {
        // Handle different response structures
        if (res.data) return res.data;
        if (res.meals) return res;
        if (Array.isArray(res))
          return { meals: res, total: res.length, page: 1, totalPages: 1 };
        return res;
      },
      providesTags: ["Meal"],
    }),

    // Get single meal by ID
    getMealById: builder.query<Meal, string>({
      query: (id) => `meals/get/${id}`,
      transformResponse: (res: any) => res.data || res,
      providesTags: ["Meal"],
    }),

    // Create new meal
    createMeal: builder.mutation<Meal, CreateMealPayload>({
      query: (payload) => ({
        url: "meals/create",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["Meal"],
    }),

    // Update meal
    updateMeal: builder.mutation<
      Meal,
      { id: string; payload: UpdateMealPayload }
    >({
      query: ({ id, payload }) => ({
        url: `meals/update/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: any) => res.data || res,
      invalidatesTags: ["Meal"],
    }),

    // Delete meal (soft delete)
    deleteMeal: builder.mutation<void, string>({
      query: (id) => ({
        url: `meals/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meal"],
    }),

    // Get meals by type (for dashboard)
    getMealsByType: builder.query<Meal[], string>({
      query: (mealType) =>
        `meals/getAll?mealType=${mealType}&limit=5&status=active`,
      transformResponse: (res: any) => {
        if (res.data) return res.data;
        if (res.meals) return res.meals;
        if (Array.isArray(res)) return res;
        return [];
      },
      providesTags: ["Meal"],
    }),

    // Get meals by tags (for recommendations)
    getMealsByTags: builder.query<Meal[], string>({
      query: (tags) => `meals/getAll?tags=${tags}&limit=10&status=active`,
      transformResponse: (res: any) => {
        if (res.data) return res.data;
        if (res.meals) return res.meals;
        if (Array.isArray(res)) return res;
        return [];
      },
      providesTags: ["Meal"],
    }),
  }),
});

export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  useGetMealsByTypeQuery,
  useGetMealsByTagsQuery,
} = mealApi;
