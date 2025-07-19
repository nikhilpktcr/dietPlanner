import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Button from "../components/FormFields/ButtonComp";
import { useGetUserProfileQuery } from "../redux/services/userProfileApi";
import { useGetBmiLogsQuery } from "../redux/services/bmiLogApi";

const Dashboard: React.FC = () => {
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

  // RTK Query hooks
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useGetUserProfileQuery(userId, {
    skip: !userId,
  });

  const {
    data: bmiLogsData,
    isLoading: bmiLoading,
    error: bmiError,
  } = useGetBmiLogsQuery(
    {
      page: 1,
      limit: 5,
    },
    {
      skip: !userId,
    }
  );

  // Helper functions
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5)
      return {
        label: "Underweight",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      };
    if (bmi < 25)
      return {
        label: "Normal",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    if (bmi < 30)
      return {
        label: "Overweight",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    return { label: "Obese", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case "sedentary":
        return "text-red-600";
      case "light":
        return "text-orange-600";
      case "moderate":
        return "text-yellow-600";
      case "active":
        return "text-green-600";
      case "very active":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getHealthGoalColor = (goal: string) => {
    switch (goal) {
      case "weightLoss":
        return "text-red-600";
      case "weightGain":
        return "text-blue-600";
      case "maintenance":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Calculate BMI trend
  const calculateBMITrend = () => {
    if (!bmiLogsData?.logs || bmiLogsData.logs.length < 2) return null;

    const sortedLogs = [...bmiLogsData.logs].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const firstBMI = sortedLogs[0].bmi;
    const lastBMI = sortedLogs[sortedLogs.length - 1].bmi;
    const difference = lastBMI - firstBMI;

    return {
      difference: difference.toFixed(1),
      trend:
        difference > 0
          ? "increasing"
          : difference < 0
          ? "decreasing"
          : "stable",
      percentage: ((Math.abs(difference) / firstBMI) * 100).toFixed(1),
    };
  };

  const bmiTrend = calculateBMITrend();
  const profile = (profileData as any)?.response || profileData;

  if (profileLoading || bmiLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (profileError || bmiError) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-red-600 mb-4 text-base sm:text-lg font-medium">
            Error loading dashboard data. Please try again.
          </div>
          <Button
            onClick={() => window.location.reload()}
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Here's your health and fitness overview
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Current BMI */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current BMI</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.weightCm && profile?.heightCm
                  ? calculateBMI(profile.weightCm, profile.heightCm)
                  : "N/A"}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          {profile?.weightCm && profile?.heightCm && (
            <div className="mt-2">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  getBMICategory(
                    Number(calculateBMI(profile.weightCm, profile.heightCm))
                  ).bgColor
                } ${
                  getBMICategory(
                    Number(calculateBMI(profile.weightCm, profile.heightCm))
                  ).color
                }`}
              >
                {
                  getBMICategory(
                    Number(calculateBMI(profile.weightCm, profile.heightCm))
                  ).label
                }
              </span>
            </div>
          )}
        </div>

        {/* BMI Logs Count */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">BMI Entries</p>
              <p className="text-2xl font-bold text-gray-900">
                {bmiLogsData?.total || 0}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Total tracking entries</p>
        </div>

        {/* BMI Trend */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">BMI Trend</p>
              <p className="text-2xl font-bold text-gray-900">
                {bmiTrend ? `${bmiTrend.difference}` : "N/A"}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          {bmiTrend && (
            <p
              className={`text-xs font-medium ${
                bmiTrend.trend === "increasing"
                  ? "text-red-600"
                  : bmiTrend.trend === "decreasing"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {bmiTrend.trend.charAt(0).toUpperCase() + bmiTrend.trend.slice(1)}{" "}
              ({bmiTrend.percentage}%)
            </p>
          )}
        </div>

        {/* Profile Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Profile Status
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {profile ? "Complete" : "Incomplete"}
              </p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {profile ? "All information provided" : "Complete your profile"}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Health Profile Overview
              </h2>
            </div>
            <div className="p-6">
              {profile ? (
                <div className="space-y-6">
                  {/* Physical Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                      Physical Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Height</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {profile.heightCm} cm
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {profile.weightCm} kg
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Health Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                      Health Preferences
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Dietary Preference
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {profile.dietaryPreferences === "veg"
                            ? "Vegetarian"
                            : "Non-Vegetarian"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Activity Level</p>
                        <p
                          className={`text-lg font-semibold ${getActivityLevelColor(
                            profile.activityLevel
                          )}`}
                        >
                          {profile.activityLevel.charAt(0).toUpperCase() +
                            profile.activityLevel.slice(1)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Health Goal</p>
                        <p
                          className={`text-lg font-semibold ${getHealthGoalColor(
                            profile.healthGoals
                          )}`}
                        >
                          {profile.healthGoals === "weightLoss"
                            ? "Weight Loss"
                            : profile.healthGoals === "weightGain"
                            ? "Weight Gain"
                            : "Maintenance"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Allergies</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.allergies.length > 0 ? (
                            profile.allergies.map((allergy: string) => (
                              <span
                                key={allergy}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                              >
                                {allergy}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={() => navigate("/profile")}
                      variant="primary"
                      className="flex-1"
                    >
                      Update Profile
                    </Button>
                    <Button
                      onClick={() => navigate("/diet")}
                      variant="secondary"
                      className="flex-1"
                    >
                      View Diet Plan
                    </Button>
                  </div>
                </div>
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Set up your health profile to get personalized
                    recommendations.
                  </p>
                  <Button
                    onClick={() => navigate("/profile")}
                    variant="primary"
                  >
                    Complete Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent BMI Logs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Recent BMI Logs</h2>
            </div>
            <div className="p-6">
              {bmiLogsData?.logs && bmiLogsData.logs.length > 0 ? (
                <div className="space-y-4">
                  {bmiLogsData.logs.slice(0, 5).map((log) => (
                    <div
                      key={log._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.bmi}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBMICategory(
                          log.category
                        )}`}
                      >
                        {getBMICategoryLabel(log.category)}
                      </span>
                    </div>
                  ))}
                  <Button
                    onClick={() => navigate("/bmi-logs")}
                    variant="secondary"
                    className="w-full mt-4"
                  >
                    View All Logs
                  </Button>
                </div>
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No BMI Logs Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start tracking your BMI to monitor your progress.
                  </p>
                  <Button
                    onClick={() => navigate("/bmi-logs")}
                    variant="primary"
                  >
                    Add First Entry
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
