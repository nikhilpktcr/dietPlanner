import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      setUser(null);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <main className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white border border-gray-100 rounded-2xl flex flex-col items-center shadow-md">
          <div className="bg-indigo-500 rounded-full p-4 mb-7 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 1.343-3 3v1a3 3 0 006 0v-1c0-1.657-1.343-3-3-3zm0 0V6m0 8v2m-6 4h12a2 2 0 002-2v-6a9 9 0 10-18 0v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">
            Diet Planner System
          </h1>
          <p className="text-sm sm:text-base text-gray-500 text-center mb-8 sm:mb-10 max-w-md">
            Welcome to your personalized diet planning platform. Manage your
            health profile and get customized meal recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              to="/login"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-lg font-semibold text-center transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-sm text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 border border-indigo-600 text-indigo-700 hover:bg-indigo-50 py-2.5 px-6 rounded-lg font-semibold text-center transition focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 text-sm sm:text-base"
            >
              Register
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Ready to continue your health journey? Here's what you can do today.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Your Profile</h3>
            <p className="text-blue-100 text-sm">
              Manage your health information
            </p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Update your height, weight, dietary preferences, and health goals.
            </p>
            <Link
              to="/profile"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Diet Plan Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Diet Plan</h3>
            <p className="text-green-100 text-sm">
              Get personalized meal recommendations
            </p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              View your customized meal plan based on your health profile and
              goals.
            </p>
            <Link
              to="/diet"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              View Diet Plan
            </Link>
          </div>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Dashboard</h3>
            <p className="text-purple-100 text-sm">Overview and analytics</p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Track your progress and view detailed analytics of your health
              journey.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-gray-800">Profile Updated</p>
              <p className="text-sm text-gray-600">
                Your health profile was last updated recently
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-gray-800">Diet Plan Generated</p>
              <p className="text-sm text-gray-600">
                Your personalized diet plan is ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
