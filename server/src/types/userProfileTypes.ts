export type TCreateUserProfileBody = {
  userId: string;
  heightCm: number;
  weightCm: number;
  dietaryPreferences: "veg" | "non veg";
  allergies: string[];
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very active";
  healthGoals: "weightLoss" | "weightGain" | "maintenance";
};

export type TUpdateUserProfileBody = {
  heightCm?: number;
  weightCm?: number;
  dietaryPreferences?: "veg" | "non-veg";
  allergies?: string[];
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very active";
  healthGoals?: "weightLoss" | "weightGain" | "maintenance";
};
