export type TCreateMealBody = {
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
};

export type TUpdateMealBody = {
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
};

export type TGetAllMealsQueryParams = {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: string;
  offset?: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snacks";
  type?: "veg" | "non veg";
  tags?: "weightLoss" | "weightGain" | "maintenance";
  status?: "active" | "in active" | "deleted";
};
