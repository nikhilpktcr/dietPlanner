import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormInput from "../../components/FormFields/FormInput";
import FormSelect from "../../components/FormFields/FormSelect";
import FormMultiSelect from "../../components/FormFields/FormMultiSelect";
import Button from "../../components/FormFields/ButtonComp";
import Spinner from "../../components/Spinner";
import {
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  CreateUserProfilePayload,
  UpdateUserProfilePayload,
} from "../../redux/services/userProfileApi";

// Validation schema
const UserProfileSchema = Yup.object().shape({
  heightCm: Yup.number()
    .min(100, "Height must be at least 100cm")
    .max(250, "Height must be less than 250cm")
    .required("Height is required"),
  weightCm: Yup.number()
    .min(30, "Weight must be at least 30kg")
    .max(300, "Weight must be less than 300kg")
    .required("Weight is required"),
  dietaryPreferences: Yup.string()
    .oneOf(["veg", "non veg"], "Please select dietary preference")
    .required("Dietary preference is required"),
  allergies: Yup.array()
    .min(1, "At least one allergy must be selected")
    .required("Allergies are required"),
  activityLevel: Yup.string()
    .oneOf(
      ["sedentary", "light", "moderate", "active", "very active"],
      "Please select activity level"
    )
    .required("Activity level is required"),
  healthGoals: Yup.string()
    .oneOf(
      ["weightLoss", "weightGain", "maintenance"],
      "Please select health goal"
    )
    .required("Health goal is required"),
});

// Select options
const dietaryOptions = [
  { _id: "veg", name: "Vegetarian" },
  { _id: "non veg", name: "Non Vegetarian" },
];

const activityLevelOptions = [
  { _id: "sedentary", name: "Sedentary (Little or no exercise)" },
  { _id: "light", name: "Light (Light exercise/sports 1-3 days/week)" },
  {
    _id: "moderate",
    name: "Moderate (Moderate exercise/sports 3-5 days/week)",
  },
  { _id: "active", name: "Active (Hard exercise/sports 6-7 days a week)" },
  {
    _id: "very active",
    name: "Very Active (Very hard exercise, physical job)",
  },
];

const healthGoalOptions = [
  { _id: "weightLoss", name: "Weight Loss" },
  { _id: "weightGain", name: "Weight Gain" },
  { _id: "maintenance", name: "Maintenance" },
];

const allergyOptions = [
  { _id: "nuts", name: "Nuts" },
  { _id: "dairy", name: "Dairy" },
  { _id: "gluten", name: "Gluten" },
  { _id: "eggs", name: "Eggs" },
  { _id: "shellfish", name: "Shellfish" },
  { _id: "soy", name: "Soy" },
  { _id: "wheat", name: "Wheat" },
  { _id: "fish", name: "Fish" },
  { _id: "none", name: "None" },
];

const UserProfilePage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>("");
  const navigate = useNavigate();

  // Get user ID from localStorage or context (you may need to adjust this based on your auth setup)
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        const id = userData.userId || userData._id;

        setUserId(id);
      } else {
        setUserId(null);
      }
    } catch (error) {
      setUserId(null);
    }
  }, []);

  // RTK Query hooks
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery(userId || "", {
    skip: !userId,
  });

  const [createProfile, { isLoading: isCreating }] =
    useCreateUserProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getBmiColor = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-600";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-600";
    return "text-red-600";
  };

  // Form handlers
  const handleCreateProfile = async (values: CreateUserProfilePayload) => {
    try {
      await createProfile({
        userId: userId!,
        ...values,
      }).unwrap();
      toast.success("Profile created successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  const handleUpdateProfile = async (values: UpdateUserProfilePayload) => {
    try {
      await updateProfile({
        userId: userId!,
        payload: values,
      }).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
    } catch (error: unknown) {
      toast.error("Failed to update profile");
    }
  };

  // Debug logging
  console.log("UserProfile - userId:", userId);
  console.log("UserProfile - profileData:", profileData);
  console.log("UserProfile - isLoading:", isLoading);
  console.log("UserProfile - error:", error);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    console.log("Profile error details:", error);
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-red-600 mb-4 text-base sm:text-lg font-medium">
            Error loading profile. Please try again.
          </div>
          <Button
            onClick={() => refetch()}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
          User Profile
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage your health profile and dietary preferences
        </p>
      </div>

      {!profileData ? (
        // Create Profile Form - when no profile exists
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Create Your Profile
            </h2>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Set up your health profile and preferences
            </p>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <Formik
              initialValues={{
                heightCm: 170,
                weightCm: 70,
                dietaryPreferences: "veg",
                allergies: [],
                activityLevel: "active",
                healthGoals: "maintenance",
              }}
              validationSchema={UserProfileSchema}
              onSubmit={handleCreateProfile}
            >
              {({ values }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="heightCm"
                      labelName="Height (cm)"
                      placeHolder="Enter height in cm"
                      type="number"
                      value={values.heightCm}
                    />
                    <FormInput
                      name="weightCm"
                      labelName="Weight (kg)"
                      placeHolder="Enter weight in kg"
                      type="number"
                      value={values.weightCm}
                    />
                  </div>

                  <FormSelect
                    name="dietaryPreferences"
                    labelName="Dietary Preferences"
                    data={dietaryOptions}
                  />

                  <FormMultiSelect
                    name="allergies"
                    labelName="Allergies"
                    data={allergyOptions}
                  />

                  <FormSelect
                    name="activityLevel"
                    labelName="Activity Level"
                    data={activityLevelOptions}
                  />

                  <FormSelect
                    name="healthGoals"
                    labelName="Health Goals"
                    data={healthGoalOptions}
                  />

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isCreating}
                      className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold w-full sm:w-auto"
                    >
                      {isCreating ? "Creating..." : "Create Profile"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        // Update Profile Form - when profile exists
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Update Your Profile
            </h2>
            <p className="text-green-100 mt-1 text-sm sm:text-base">
              Modify your health profile and preferences
            </p>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <h4 className="font-semibold text-black mb-2 sm:mb-3 text-base sm:text-lg border-b border-blue-200 pb-2">
                    Current Physical Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-black">
                      <span className="font-semibold text-blue-600">
                        Height:
                      </span>{" "}
                      {profileData?.heightCm} cm
                    </p>
                    <p className="text-black">
                      <span className="font-semibold text-blue-600">
                        Weight:
                      </span>{" "}
                      {profileData?.weightCm} kg
                    </p>
                    <p className="text-black">
                      <span className="font-semibold text-blue-600">BMI:</span>{" "}
                      {profileData?.weightCm && profileData?.heightCm
                        ? calculateBMI(
                            profileData.weightCm,
                            profileData.heightCm
                          )
                        : "N/A"}{" "}
                      (
                      {profileData?.weightCm && profileData?.heightCm
                        ? getBMICategory(
                            Number(
                              calculateBMI(
                                profileData.weightCm,
                                profileData.heightCm
                              )
                            )
                          )
                        : "N/A"}
                      )
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2 sm:mb-3 text-base sm:text-lg border-b border-green-200 pb-2">
                    Current Preferences
                  </h4>
                  <div className="space-y-2">
                    <p className="text-black">
                      <span className="font-semibold text-green-600">
                        Dietary:
                      </span>{" "}
                      {profileData?.dietaryPreferences === "veg"
                        ? "Vegetarian"
                        : "Non-Vegetarian"}
                    </p>
                    <p className="text-black">
                      <span className="font-semibold text-green-600">
                        Activity Level:
                      </span>{" "}
                      {profileData?.activityLevel}
                    </p>
                    <p className="text-black">
                      <span className="font-semibold text-green-600">
                        Health Goal:
                      </span>{" "}
                      {profileData?.healthGoals}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4 sm:mb-6">
                <h4 className="font-semibold text-black mb-2 sm:mb-3 text-base sm:text-lg border-b border-red-200 pb-2">
                  Current Allergies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profileData.allergies.length > 0 ? (
                    profileData.allergies.map((allergy: string) => (
                      <span
                        key={allergy}
                        className="px-2 sm:px-3 py-1 sm:py-2 bg-red-50 text-red-700 rounded-full text-xs sm:text-sm font-medium border border-red-200"
                      >
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm sm:text-base">
                      No allergies listed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Formik
              initialValues={{
                heightCm: profileData.heightCm,
                weightCm: profileData.weightCm,
                dietaryPreferences: profileData.dietaryPreferences,
                allergies: profileData.allergies,
                activityLevel: profileData.activityLevel,
                healthGoals: profileData.healthGoals,
              }}
              validationSchema={UserProfileSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ values }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="heightCm"
                      labelName="Height (cm)"
                      placeHolder="Enter height in cm"
                      type="number"
                      value={values.heightCm}
                    />
                    <FormInput
                      name="weightCm"
                      labelName="Weight (kg)"
                      placeHolder="Enter weight in kg"
                      type="number"
                      value={values.weightCm}
                    />
                  </div>

                  <FormSelect
                    name="dietaryPreferences"
                    labelName="Dietary Preferences"
                    data={dietaryOptions}
                  />

                  <FormMultiSelect
                    name="allergies"
                    labelName="Allergies"
                    data={allergyOptions}
                  />

                  <FormSelect
                    name="activityLevel"
                    labelName="Activity Level"
                    data={activityLevelOptions}
                  />

                  <FormSelect
                    name="healthGoals"
                    labelName="Health Goals"
                    data={healthGoalOptions}
                  />

                  <div className="flex justify-end space-x-3 pt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isUpdating}
                      className="px-6 py-3 text-lg font-semibold"
                    >
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
