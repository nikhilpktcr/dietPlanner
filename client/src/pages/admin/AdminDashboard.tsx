import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { Table as TableComp } from "../../components/Table/TableComp";
import StatsCard from "../../components/StatsCard";
import SectionCard from "../../components/SectionCard";
import QuickActionButton from "../../components/QuickActionButton";
import StatusIndicator from "../../components/StatusIndicator";
import SystemStatusCard from "../../components/SystemStatusCard";
import { useGetMealsQuery } from "../../redux/services/mealApi";
import { useGetBmiLogsQuery } from "../../redux/services/bmiLogApi";

interface User {
  name: string;
  role: string;
}

interface Meal {
  _id: string;
  title: string;
  type: string;
  mealType: string;
  calories: number;
  status: string;
  createdAt: string;
}

interface BmiLog {
  _id: string;
  bmi: number;
  weightCm: number;
  heightCm: number;
  category: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get user data from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      setUser(null);
    }
  }, []);

  // RTK Query hooks
  const {
    data: mealsData,
    isLoading: mealsLoading,
    error: mealsError,
  } = useGetMealsQuery({
    limit: "10",
    status: "active",
  });

  const {
    data: bmiLogsData,
    isLoading: bmiLoading,
    error: bmiError,
  } = useGetBmiLogsQuery({
    page: 1,
    limit: 10,
  });

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLoading = mealsLoading || bmiLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (mealsError || bmiError) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-red-600 mb-4 text-base sm:text-lg font-medium">
            Error loading admin dashboard data. Please try again.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalMeals = mealsData?.meals?.length || 0;
  const vegetarianMeals =
    mealsData?.meals?.filter((m: Meal) => m.type === "veg").length || 0;
  const nonVegetarianMeals =
    mealsData?.meals?.filter((m: Meal) => m.type === "non veg").length || 0;
  const activeMeals =
    mealsData?.meals?.filter((m: Meal) => m.status === "active").length || 0;
  const totalBmiLogs = bmiLogsData?.total || 0;
  const recentBmiLogs = bmiLogsData?.logs?.slice(0, 5) || [];

  // Table columns for recent meals
  const mealColumns = [
    {
      key: "title" as keyof Meal,
      label: "Title",
      render: (meal: Meal) => meal.title,
    },
    {
      key: "type" as keyof Meal,
      label: "Type",
      render: (meal: Meal) => (
        <StatusIndicator
          status={meal.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
          className={
            meal.type === "veg"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        />
      ),
    },
    {
      key: "mealType" as keyof Meal,
      label: "Meal Type",
      render: (meal: Meal) => (
        <span className="capitalize">{meal.mealType}</span>
      ),
    },
    {
      key: "calories" as keyof Meal,
      label: "Calories",
      render: (meal: Meal) => `${meal.calories} cal`,
    },
    {
      key: "status" as keyof Meal,
      label: "Status",
      render: (meal: Meal) => <StatusIndicator status={meal.status} />,
    },
  ];

  // Table columns for recent BMI logs
  const bmiLogColumns = [
    {
      key: "bmi" as keyof BmiLog,
      label: "BMI",
      render: (log: BmiLog) => log.bmi,
    },
    {
      key: "weightCm" as keyof BmiLog,
      label: "Weight (kg)",
      render: (log: BmiLog) => log.weightCm,
    },
    {
      key: "heightCm" as keyof BmiLog,
      label: "Height (cm)",
      render: (log: BmiLog) => log.heightCm,
    },
    {
      key: "category" as keyof BmiLog,
      label: "Category",
      render: (log: BmiLog) => <StatusIndicator status={log.category} />,
    },
    {
      key: "createdAt" as keyof BmiLog,
      label: "Date",
      render: (log: BmiLog) => formatDate(log.createdAt),
    },
  ];

  // System status items
  const systemStatusItems = [
    {
      label: "System Online",
      status: "online" as const,
      color: "green" as const,
    },
    {
      label: "Database Connected",
      status: "connected" as const,
      color: "blue" as const,
    },
    {
      label: "API Services Active",
      status: "active" as const,
      color: "green" as const,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Welcome back, {user?.name}! Here's your system overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Meals"
          value={totalMeals}
          subtitle="Active meals in system"
          color="blue"
        />

        <StatsCard
          title="Vegetarian"
          value={vegetarianMeals}
          subtitle="Veg meal options"
          color="green"
        />

        <StatsCard
          title="Non-Vegetarian"
          value={nonVegetarianMeals}
          subtitle="Non-veg meal options"
          color="red"
        />

        <StatsCard
          title="BMI Logs"
          value={totalBmiLogs}
          subtitle="Total tracking entries"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Recent Meals */}
        <SectionCard title="Recent Meals" gradient="blue">
          {mealsData?.meals && mealsData.meals.length > 0 ? (
            <TableComp
              data={mealsData.meals.slice(0, 5)}
              columns={mealColumns as any}
              page={currentPage}
              totalPages={1}
              onPageChange={handlePageChange}
              emptyMessage="No meals found"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No meals found
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding meals to the system.
              </p>
              <QuickActionButton
                onClick={() => navigate("/admin/meals")}
                variant="primary"
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                }
              >
                Add Meals
              </QuickActionButton>
            </div>
          )}
        </SectionCard>

        {/* Recent BMI Logs */}
        <SectionCard title="Recent BMI Logs" gradient="green">
          {recentBmiLogs.length > 0 ? (
            <TableComp
              data={recentBmiLogs}
              columns={bmiLogColumns as any}
              page={currentPage}
              totalPages={1}
              onPageChange={handlePageChange}
              emptyMessage="No BMI logs found"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No BMI logs yet
              </h3>
              <p className="text-gray-500 mb-4">
                Users haven't started tracking their BMI.
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* System Overview */}
      <SectionCard
        title="System Overview"
        gradient="purple"
        className="mb-6 sm:mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Meal Distribution
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vegetarian</span>
                <span className="font-semibold text-green-600">
                  {vegetarianMeals}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Non-Vegetarian</span>
                <span className="font-semibold text-red-600">
                  {nonVegetarianMeals}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Meals</span>
                <span className="font-semibold text-blue-600">
                  {activeMeals}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              User Activity
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total BMI Logs</span>
                <span className="font-semibold text-purple-600">
                  {totalBmiLogs}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recent Activity</span>
                <span className="font-semibold text-green-600">
                  {recentBmiLogs.length}
                </span>
              </div>
            </div>
          </div>

          <SystemStatusCard title="System Status" items={systemStatusItems} />
        </div>
      </SectionCard>

      {/* Quick Actions */}
      <SectionCard title="Quick Actions" gradient="orange">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            onClick={() => navigate("/admin/meals")}
            variant="primary"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
          >
            Add Meal
          </QuickActionButton>

          <QuickActionButton
            onClick={() => navigate("/admin/meals")}
            variant="secondary"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            }
          >
            Manage Meals
          </QuickActionButton>

          <QuickActionButton
            onClick={() => navigate("/users")}
            variant="confirm"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            }
          >
            Manage Users
          </QuickActionButton>

          <QuickActionButton
            onClick={() => navigate("/dashboard")}
            variant="secondary"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          >
            View Reports
          </QuickActionButton>
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminDashboard;
