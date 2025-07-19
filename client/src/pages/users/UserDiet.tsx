import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "../../components/Card";
import Button from "../../components/FormFields/ButtonComp";
import Spinner from "../../components/Spinner";
import { Table } from "../../components/Table/TableComp";
import { useGetMealsByTypeQuery, Meal } from "../../redux/services/mealApi";
import {
  useGetUserDietPlanQuery,
  useGenerateDietPlanMutation,
} from "../../redux/services/dietPlanApi";
import {
  useGetUserRecentDietLogsQuery,
  useGetUserDietLogStatsQuery,
} from "../../redux/services/dietLogApi";

const UserDiet: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  // Get user data from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const id = parsedUser._id || parsedUser.userId;
        setUserId(id);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      setUser(null);
      setUserId("");
    }
  }, []);

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // RTK Query hooks
  const { data: breakfastMeals, isLoading: breakfastLoading } =
    useGetMealsByTypeQuery("breakfast", {
      skip: !userId,
    });

  const { data: lunchMeals, isLoading: lunchLoading } = useGetMealsByTypeQuery(
    "lunch",
    {
      skip: !userId,
    }
  );

  const { data: dinnerMeals, isLoading: dinnerLoading } =
    useGetMealsByTypeQuery("dinner", {
      skip: !userId,
    });

  const { data: snackMeals, isLoading: snackLoading } = useGetMealsByTypeQuery(
    "snacks",
    {
      skip: !userId,
    }
  );

  const {
    data: userDietPlan,
    isLoading: dietPlanLoading,
    refetch: refetchDietPlan,
  } = useGetUserDietPlanQuery(userId, {
    skip: !userId,
  });

  const { data: recentDietLogs, isLoading: dietLogsLoading } =
    useGetUserRecentDietLogsQuery({ userId, limit: 5 }, { skip: !userId });

  const { data: dietLogStats, isLoading: statsLoading } =
    useGetUserDietLogStatsQuery({ userId }, { skip: !userId });

  const [generateDietPlan, { isLoading: isGenerating }] =
    useGenerateDietPlanMutation();

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "bg-green-100 text-green-800";
      case "skipped":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "taken":
        return "Completed";
      case "skipped":
        return "Skipped";
      case "partial":
        return "Partial";
      default:
        return status;
    }
  };

  const handleGenerateDietPlan = async () => {
    try {
      setIsGenerating(true);
      // Simulate diet plan generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Diet plan generated successfully!");
    } catch (error) {
      toast.error("Failed to generate diet plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const isLoading =
    breakfastLoading ||
    lunchLoading ||
    dinnerLoading ||
    snackLoading ||
    dietPlanLoading ||
    dietLogsLoading ||
    statsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  // Table columns for recent diet logs
  const dietLogColumns = [
    {
      key: "meal",
      label: "Meal",
      render: (log: any) => log.meal?.title || "N/A",
    },
    { key: "date", label: "Date", render: (log: any) => formatDate(log.date) },
    {
      key: "status",
      label: "Status",
      render: (log: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            log.status
          )}`}
        >
          {getStatusLabel(log.status)}
        </span>
      ),
    },
    {
      key: "calories",
      label: "Calories",
      render: (log: any) => log.meal?.calories || "N/A",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
          Your Diet Plan
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Personalized meal recommendations based on your health profile
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Calories
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {dietLogStats?.totalCalories || 0}
            </p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Protein
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {dietLogStats?.totalProtein || 0}g
            </p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Carbs</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {dietLogStats?.totalCarbs || 0}g
            </p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fats</h3>
            <p className="text-3xl font-bold text-red-600">
              {dietLogStats?.totalFats || 0}g
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Available Meals */}
        <div className="space-y-6">
          <Card className="bg-white">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 -mx-6 -mt-6 mb-6">
              <h2 className="text-xl font-bold text-white">Available Meals</h2>
            </div>

            {/* Breakfast */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-orange-200 pb-2">
                🍳 Breakfast ({breakfastMeals?.length || 0})
              </h3>
              <div className="space-y-3">
                {breakfastMeals?.slice(0, 3).map((meal: Meal) => (
                  <div key={meal._id} className="bg-orange-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {meal.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {meal.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        {meal.calories} cal
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-green-200 pb-2">
                🥗 Lunch ({lunchMeals?.length || 0})
              </h3>
              <div className="space-y-3">
                {lunchMeals?.slice(0, 3).map((meal: Meal) => (
                  <div key={meal._id} className="bg-green-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {meal.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {meal.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {meal.calories} cal
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-purple-200 pb-2">
                🍽️ Dinner ({dinnerMeals?.length || 0})
              </h3>
              <div className="space-y-3">
                {dinnerMeals?.slice(0, 3).map((meal: Meal) => (
                  <div key={meal._id} className="bg-purple-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {meal.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {meal.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {meal.calories} cal
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Snacks */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-yellow-200 pb-2">
                🍎 Snacks ({snackMeals?.length || 0})
              </h3>
              <div className="space-y-3">
                {snackMeals?.slice(0, 3).map((meal: Meal) => (
                  <div key={meal._id} className="bg-yellow-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {meal.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {meal.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        {meal.calories} cal
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Diet Logs */}
        <div>
          <Card className="bg-white">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 -mx-6 -mt-6 mb-6">
              <h2 className="text-xl font-bold text-white">Recent Diet Logs</h2>
            </div>

            {recentDietLogs && recentDietLogs.length > 0 ? (
              <Table
                data={recentDietLogs}
                columns={dietLogColumns}
                className="w-full"
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No diet logs yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start tracking your meals to see your progress.
                </p>
                <Button onClick={() => navigate("/bmi-logs")} variant="primary">
                  Start Tracking
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Current Diet Plan */}
      {userDietPlan && (
        <Card className="bg-white mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 -mx-6 -mt-6 mb-6">
            <h2 className="text-xl font-bold text-white">Current Diet Plan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Plan Details
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {formatDate(userDietPlan.startDate)}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {formatDate(userDietPlan.endDate)}
                </p>
                <p>
                  <span className="font-medium">Daily Meals:</span>{" "}
                  {userDietPlan.daily.length}
                </p>
                <p>
                  <span className="font-medium">Weekly Meals:</span>{" "}
                  {userDietPlan.weekly.length}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Plan Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Active Plan</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Personalized for your goals</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={handleGenerateDietPlan}
          variant="primary"
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-semibold"
        >
          {isGenerating ? "Generating..." : "Generate New Plan"}
        </Button>
        <Button
          onClick={() => navigate("/bmi-logs")}
          variant="secondary"
          className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-semibold"
        >
          Track BMI Progress
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          variant="confirm"
          className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-semibold"
        >
          View Dashboard
        </Button>
      </div>

      {/* Admin Only Section */}
      {isAdmin && (
        <div className="mt-6 sm:mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Admin Controls
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => navigate("/admin/meals")}
                variant="primary"
                className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-semibold"
              >
                Manage Meals
              </Button>
              <Button
                onClick={() => navigate("/users")}
                variant="secondary"
                className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-semibold"
              >
                Manage Users
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDiet;
